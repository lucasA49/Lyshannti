// Catégories et tags (page « Catégories et tags » de l'admin).
// Demain : tables categories, tags et article_tags (Prisma), slug unique.
// Une catégorie qui contient des articles ne peut pas être supprimée tant que
// ses articles ne sont pas déplacés (évite des articles orphelins et des 404).

import { demoPosts, demoTags } from "@/content/admin.placeholder"
import { categoriesPlaceholder } from "@/content/posts.placeholder"
import type { CategoryIcon } from "@/lib/blog-types"

export const categoryIconChoices: { value: CategoryIcon; label: string }[] = [
  { value: "lotus", label: "Lotus" },
  { value: "sparkles", label: "Étincelles" },
  { value: "heart", label: "Cœur" },
  { value: "leaf", label: "Feuille" },
  { value: "feather", label: "Plume" },
  { value: "lightbulb", label: "Ampoule" },
]

export type AdminCategory = { slug: string; name: string; icon: CategoryIcon; count: number }
export type AdminTag = { slug: string; name: string; count: number }

const fromDatabase = () => (process.env.DATABASE_URL ? import("@/lib/admin/admin-db") : null)

export async function getAdminTaxonomy(): Promise<{ categories: AdminCategory[]; tags: AdminTag[] }> {
  const database = await fromDatabase()
  if (database) return database.getAdminTaxonomy()

  const posts = demoPosts.filter((post) => !post.deletedAt)
  return {
    categories: categoriesPlaceholder.map((category) => ({
      ...category,
      count: posts.filter((post) => post.category === category.slug).length,
    })),
    tags: [...demoTags].sort((a, b) => a.name.localeCompare(b.name, "fr")),
  }
}
