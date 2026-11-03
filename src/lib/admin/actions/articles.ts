"use server"

// Actions de la liste des articles (admin). Chaque action :
// 1. vérifie la session admin (requireAdmin) — jamais confiance au navigateur ;
// 2. valide les paramètres (Zod) ;
// 3. modifie la base, puis régénère les pages concernées (blog public + admin).

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"

export type ActionResult = { ok: true; message: string } | { ok: false; message: string }

const idSchema = z.string().min(1).max(64)

function refresh() {
  revalidatePath("/admin", "layout")
  revalidatePath("/blog", "layout")
  revalidatePath("/")
  revalidatePath("/sitemap.xml")
}

async function run(id: unknown, action: (id: string) => Promise<string>): Promise<ActionResult> {
  if (!process.env.DATABASE_URL) return { ok: false, message: "Base de données non configurée." }
  await requireAdmin()
  const parsed = idSchema.safeParse(id)
  if (!parsed.success) return { ok: false, message: "Article introuvable." }
  try {
    const message = await action(parsed.data)
    refresh()
    return { ok: true, message }
  } catch (error) {
    console.error("[admin/articles]", error)
    return { ok: false, message: "L'action n'a pas pu être enregistrée. Réessayez." }
  }
}

/** Retire l'article du site sans le supprimer (il redevient un brouillon). */
export async function setArticleDraft(id: string) {
  return run(id, async (articleId) => {
    const article = await db.article.update({ where: { id: articleId }, data: { status: "DRAFT" } })
    return `« ${article.title} » est repassé en brouillon : il n'est plus visible sur le site.`
  })
}

/** Publie immédiatement (garde la date d'origine si l'article a déjà été publié). */
export async function publishArticle(id: string) {
  return run(id, async (articleId) => {
    const current = await db.article.findUniqueOrThrow({ where: { id: articleId }, select: { publishedAt: true } })
    const now = new Date()
    const publishedAt = current.publishedAt && current.publishedAt <= now ? current.publishedAt : now
    const article = await db.article.update({
      where: { id: articleId },
      data: { status: "PUBLISHED", publishedAt, deletedAt: null },
    })
    return `« ${article.title} » est publié.`
  })
}

export async function trashArticle(id: string) {
  return run(id, async (articleId) => {
    const article = await db.article.update({ where: { id: articleId }, data: { deletedAt: new Date() } })
    return `« ${article.title} » est dans la corbeille.`
  })
}

export async function restoreArticle(id: string) {
  return run(id, async (articleId) => {
    const article = await db.article.update({ where: { id: articleId }, data: { deletedAt: null } })
    return `« ${article.title} » est restauré.`
  })
}

/** Suppression définitive : uniquement depuis la corbeille. */
export async function deleteArticlePermanently(id: string) {
  return run(id, async (articleId) => {
    const article = await db.article.findUniqueOrThrow({ where: { id: articleId }, select: { title: true, deletedAt: true } })
    if (!article.deletedAt) throw new Error("Suppression définitive refusée : l'article n'est pas dans la corbeille.")
    await db.article.delete({ where: { id: articleId } })
    return `« ${article.title} » est supprimé définitivement.`
  })
}

/** Copie en brouillon (nouvelle adresse « -copie », « -copie-2 »…). */
export async function duplicateArticle(id: string) {
  return run(id, async (articleId) => {
    const source = await db.article.findUniqueOrThrow({
      where: { id: articleId },
      include: { tags: { select: { tagId: true } } },
    })

    let slug = `${source.slug}-copie`.slice(0, 80)
    for (let n = 2; await db.article.findUnique({ where: { slug }, select: { id: true } }); n++) {
      slug = `${source.slug}-copie-${n}`.slice(0, 80)
    }

    await db.article.create({
      data: {
        slug,
        title: `${source.title} (copie)`,
        excerpt: source.excerpt,
        content: source.content ?? {},
        status: "DRAFT",
        readingMinutes: source.readingMinutes,
        categoryId: source.categoryId,
        coverId: source.coverId,
        authorId: source.authorId,
        metaTitle: source.metaTitle,
        metaDescription: source.metaDescription,
        focusKeyword: source.focusKeyword,
        ogImageId: source.ogImageId,
        tags: { create: source.tags.map(({ tagId }) => ({ tagId })) },
      },
    })
    return `Copie créée en brouillon : « ${source.title} (copie) ».`
  })
}
