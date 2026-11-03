"use server"

// Enregistrement d'un article depuis l'éditeur (création ou modification).
// Session admin vérifiée, données validées (Zod), contenu Tiptap contrôlé
// (structure et taille), adresse unique, tags créés à la volée, puis
// régénération des pages du blog.

import { revalidatePath } from "next/cache"
import { z } from "zod"

import type { ArticleStatus } from "@/generated/prisma/client"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { readingMinutes, type RichTextDoc } from "@/lib/rich-text"
import { slugify } from "@/lib/slug"

export type SaveArticleResult = { ok: true; message: string; id: string } | { ok: false; message: string }

const RESERVED_SLUGS = new Set(["page", "categorie", "recherche", "nouveau"])
const MAX_CONTENT_BYTES = 500_000

const nodeSchema: z.ZodType<unknown> = z.lazy(() =>
  z.object({
    type: z.string().max(40),
    attrs: z.record(z.string(), z.unknown()).optional(),
    content: z.array(nodeSchema).max(2000).optional(),
    text: z.string().max(20_000).optional(),
    marks: z.array(z.object({ type: z.string().max(40), attrs: z.record(z.string(), z.unknown()).optional() })).optional(),
  })
)

const articleSchema = z.object({
  id: z.string().max(64).optional(),
  title: z.string().trim().min(3, "Le titre est trop court.").max(160, "Le titre est trop long."),
  excerpt: z.string().trim().max(400, "Le chapô est trop long (400 caractères maximum)."),
  content: z.object({ type: z.literal("doc"), content: z.array(nodeSchema).max(2000) }),
  slug: z.string().trim().max(80),
  categorySlug: z.string().min(1, "Choisissez une catégorie."),
  tags: z.array(z.string().trim().min(1).max(40)).max(15, "15 tags maximum."),
  coverId: z.string().max(64).nullable(),
  coverAlt: z.string().trim().max(250),
  publishMode: z.enum(["draft", "now", "schedule"]),
  scheduledAt: z.string().max(40),
  metaTitle: z.string().trim().max(70, "Titre SEO trop long."),
  metaDescription: z.string().trim().max(200, "Meta description trop longue."),
  focusKeyword: z.string().trim().max(80),
})

export async function saveArticle(input: unknown): Promise<SaveArticleResult> {
  const admin = await requireAdmin()
  const parsed = articleSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Article invalide." }
  const data = parsed.data

  if (JSON.stringify(data.content).length > MAX_CONTENT_BYTES) {
    return { ok: false, message: "L'article est trop long pour être enregistré." }
  }

  // Adresse : unique et non réservée.
  const slug = slugify(data.slug || data.title)
  if (!slug || RESERVED_SLUGS.has(slug)) return { ok: false, message: "Adresse de la page invalide ou réservée." }
  const sameSlug = await db.article.findUnique({ where: { slug }, select: { id: true } })
  if (sameSlug && sameSlug.id !== data.id) return { ok: false, message: "Cette adresse est déjà utilisée par un autre article." }

  const category = await db.category.findUnique({ where: { slug: data.categorySlug }, select: { id: true } })
  if (!category) return { ok: false, message: "Catégorie introuvable." }

  if (data.coverId && !(await db.media.findUnique({ where: { id: data.coverId }, select: { id: true } }))) {
    return { ok: false, message: "L'image principale n'existe plus dans la bibliothèque." }
  }

  const existing = data.id
    ? await db.article.findUnique({ where: { id: data.id }, select: { id: true, status: true, publishedAt: true } })
    : null
  if (data.id && !existing) return { ok: false, message: "Article introuvable." }

  // Statut et date de publication.
  const now = new Date()
  let status: ArticleStatus = "DRAFT"
  let publishedAt: Date | null = existing?.publishedAt ?? null
  if (data.publishMode === "now") {
    status = "PUBLISHED"
    publishedAt = existing?.status === "PUBLISHED" && existing.publishedAt && existing.publishedAt <= now ? existing.publishedAt : now
  } else if (data.publishMode === "schedule") {
    const date = new Date(data.scheduledAt)
    if (Number.isNaN(date.getTime()) || date <= now) {
      return { ok: false, message: "Choisissez une date de publication dans le futur." }
    }
    status = "SCHEDULED"
    publishedAt = date
  }

  // Tags : créés s'ils n'existent pas encore.
  const tagIds: string[] = []
  for (const name of [...new Set(data.tags)]) {
    const tagSlug = slugify(name)
    if (!tagSlug) continue
    const tag = await db.tag.upsert({ where: { slug: tagSlug }, update: {}, create: { slug: tagSlug, name } })
    tagIds.push(tag.id)
  }

  const content = data.content as RichTextDoc
  const fields = {
    title: data.title,
    excerpt: data.excerpt,
    content: content as object,
    slug,
    status,
    publishedAt,
    readingMinutes: readingMinutes({
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: data.excerpt }] }, ...content.content],
    }),
    categoryId: category.id,
    coverId: data.coverId,
    metaTitle: data.metaTitle || null,
    metaDescription: data.metaDescription || null,
    focusKeyword: data.focusKeyword || null,
  }

  const article = await db.$transaction(async (tx) => {
    const saved = existing
      ? await tx.article.update({ where: { id: existing.id }, data: fields })
      : await tx.article.create({ data: { ...fields, authorId: admin.id } })
    await tx.articleTag.deleteMany({ where: { articleId: saved.id } })
    if (tagIds.length) await tx.articleTag.createMany({ data: tagIds.map((tagId) => ({ articleId: saved.id, tagId })) })
    // Le texte alternatif de l'image principale est celui de la bibliothèque.
    if (data.coverId) await tx.media.update({ where: { id: data.coverId }, data: { alt: data.coverAlt } })
    return saved
  })

  revalidatePath("/admin", "layout")
  revalidatePath("/blog", "layout")
  revalidatePath("/")
  revalidatePath("/sitemap.xml")

  const message =
    status === "PUBLISHED"
      ? "Article publié : il est en ligne."
      : status === "SCHEDULED"
        ? `Article programmé pour le ${publishedAt!.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" })}.`
        : "Brouillon enregistré."
  return { ok: true, message, id: article.id }
}
