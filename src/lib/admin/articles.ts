// Articles côté admin (liste, corbeille) : SEUL point de lecture.
// Aujourd'hui : démonstration. Demain : Prisma (table articles), après
// vérification de la session admin ; recherche, filtres, tri et pagination
// passeront alors côté serveur (paramètres d'URL).
//
// Suppression douce : « mettre à la corbeille » renseigne `deletedAt` ; une
// tâche planifiée supprime définitivement après TRASH_RETENTION_DAYS jours.

import { demoPosts } from "@/content/admin.placeholder"
import { categoriesPlaceholder } from "@/content/posts.placeholder"
import type { PostStatus, SeoIssue } from "@/lib/admin/dashboard"
import { getPostSlugs } from "@/lib/blog"

export const TRASH_RETENTION_DAYS = 30

export type AdminArticle = {
  id: string
  title: string
  slug: string
  category: { slug: string; name: string }
  status: PostStatus
  updatedAt: string
  publishedAt?: string
  deletedAt?: string
  views: number
  seoIssues: SeoIssue[]
  /** URL publique si l'article est visible sur le site. */
  publicUrl?: string
}

const fromDatabase = () => (process.env.DATABASE_URL ? import("@/lib/admin/admin-db") : null)

export async function getAdminArticles(): Promise<AdminArticle[]> {
  const database = await fromDatabase()
  if (database) return database.getAdminArticles()

  const pages = new Set(await getPostSlugs())

  return demoPosts.map((post) => {
    const category = categoriesPlaceholder.find((c) => c.slug === post.category)
    return {
      ...post,
      category: { slug: post.category, name: category?.name ?? "Sans catégorie" },
      publicUrl:
        post.status === "PUBLISHED" && !post.deletedAt && pages.has(post.slug)
          ? `/blog/${post.slug}`
          : undefined,
    }
  })
}

export async function getAdminCategories(): Promise<{ slug: string; name: string }[]> {
  const database = await fromDatabase()
  if (database) return database.getAdminCategories()
  return categoriesPlaceholder.map(({ slug, name }) => ({ slug, name }))
}
