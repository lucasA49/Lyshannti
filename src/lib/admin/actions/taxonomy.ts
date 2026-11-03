"use server"

// Catégories et tags (admin) : création, modification, suppression.

import { revalidatePath } from "next/cache"
import { z } from "zod"

import type { ActionResult } from "@/lib/admin/actions/articles"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { slugify } from "@/lib/slug"

const ICONS = ["lotus", "sparkles", "heart", "leaf", "feather", "lightbulb"] as const

const categorySchema = z.object({
  name: z.string().trim().min(2, "Nom trop court.").max(60, "Nom trop long."),
  slug: z.string().trim().max(80),
  icon: z.enum(ICONS),
})

function refresh() {
  revalidatePath("/admin", "layout")
  revalidatePath("/blog", "layout")
  revalidatePath("/sitemap.xml")
}

const RESERVED = new Set(["page", "recherche"])

/** Crée (originalSlug absent) ou modifie une catégorie. */
export async function saveCategory(
  input: { name: string; slug: string; icon: string },
  originalSlug?: string
): Promise<ActionResult> {
  await requireAdmin()
  const parsed = categorySchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Catégorie invalide." }

  const slug = slugify(parsed.data.slug || parsed.data.name)
  if (!slug || RESERVED.has(slug)) return { ok: false, message: "Adresse invalide ou réservée." }

  const existing = await db.category.findUnique({ where: { slug }, select: { slug: true } })
  if (existing && existing.slug !== originalSlug) return { ok: false, message: "Cette adresse est déjà utilisée." }

  if (originalSlug) {
    await db.category.update({ where: { slug: originalSlug }, data: { name: parsed.data.name, slug, icon: parsed.data.icon } })
  } else {
    const position = await db.category.count()
    await db.category.create({ data: { name: parsed.data.name, slug, icon: parsed.data.icon, position } })
  }
  refresh()
  return { ok: true, message: originalSlug ? "Catégorie modifiée." : `Catégorie « ${parsed.data.name} » créée.` }
}

export async function deleteCategory(slug: string): Promise<ActionResult> {
  await requireAdmin()
  const category = await db.category.findUnique({
    where: { slug },
    select: { id: true, name: true, _count: { select: { articles: true } } },
  })
  if (!category) return { ok: false, message: "Catégorie introuvable." }
  // Sécurité en plus de la contrainte en base (onDelete: Restrict).
  if (category._count.articles > 0) {
    return { ok: false, message: "Cette catégorie contient des articles (corbeille comprise) : déplacez-les d'abord." }
  }
  await db.category.delete({ where: { id: category.id } })
  refresh()
  return { ok: true, message: `Catégorie « ${category.name} » supprimée.` }
}

export async function createTag(name: string): Promise<ActionResult> {
  await requireAdmin()
  const parsed = z.string().trim().min(2, "Tag trop court.").max(40, "Tag trop long.").safeParse(name)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Tag invalide." }

  const slug = slugify(parsed.data)
  if (await db.tag.findFirst({ where: { OR: [{ slug }, { name: parsed.data }] } })) {
    return { ok: false, message: "Ce tag existe déjà." }
  }
  await db.tag.create({ data: { name: parsed.data, slug } })
  refresh()
  return { ok: true, message: `Tag « ${parsed.data} » ajouté.` }
}

export async function deleteTag(slug: string): Promise<ActionResult> {
  await requireAdmin()
  const tag = await db.tag.findUnique({ where: { slug } })
  if (!tag) return { ok: false, message: "Tag introuvable." }
  // Les liens avec les articles sont supprimés automatiquement (onDelete: Cascade).
  await db.tag.delete({ where: { id: tag.id } })
  refresh()
  return { ok: true, message: `Tag « ${tag.name} » supprimé.` }
}
