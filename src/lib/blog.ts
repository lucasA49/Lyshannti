// Accès aux données du blog : SEUL point d'entrée pour les pages (serveur).
//
// Source des données :
// - DATABASE_URL défini (développement, production) → PostgreSQL (blog-db.ts) ;
// - sinon (démo statique GitHub Pages) → données de démonstration (blog-demo.ts).
// Le module base de données est chargé à la demande : la démo n'en a pas besoin.
//
// Choix pour un blog qui grossit (plusieurs articles par semaine) :
// - pagination en pages réelles (/blog/page/2), indexables et rapides ;
// - catégories en pages dédiées (/blog/categorie/soins), bonnes pour le SEO ;
// - recherche (/blog/recherche?q=) non indexée.

import type { BlogCategory, CategoryWithCount, Paginated, PostDetail, PostSummary } from "@/lib/blog-types"

export * from "@/lib/blog-types"

export const usesDatabase = Boolean(process.env.DATABASE_URL)

const source = () => (usesDatabase ? import("@/lib/blog-db") : import("@/lib/blog-demo"))

export async function getCategories(): Promise<BlogCategory[]> {
  return (await source()).getCategories()
}

export async function getCategory(slug: string): Promise<BlogCategory | undefined> {
  return (await source()).getCategory(slug)
}

export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  return (await source()).getCategoriesWithCount()
}

export async function getPosts(options?: { categorySlug?: string; page?: number }): Promise<Paginated<PostSummary>> {
  return (await source()).getPosts(options)
}

export async function getLatestPosts(limit: number, excludeSlug?: string): Promise<PostSummary[]> {
  return (await source()).getLatestPosts(limit, excludeSlug)
}

export async function getPopularPosts(limit: number): Promise<PostSummary[]> {
  return (await source()).getPopularPosts(limit)
}

/** Slugs des articles qui ont une page (génération statique / sitemap). */
export async function getPostSlugs(): Promise<string[]> {
  return (await source()).getPostSlugs()
}

export async function getPostBySlug(slug: string): Promise<PostDetail | undefined> {
  return (await source()).getPostBySlug(slug)
}

/** Recherche serveur (avec la base). La démo statique cherche dans le navigateur. */
export async function searchPostsOnServer(query: string): Promise<PostSummary[]> {
  return (await source()).searchPosts(query)
}
