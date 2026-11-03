// Accès aux données du blog : SEUL point de lecture des articles et catégories.
// Aujourd'hui : données provisoires. Demain : requêtes Prisma (mêmes signatures,
// fonctions déjà asynchrones), sans toucher aux pages ni aux composants.
//
// Choix pour un blog qui grossit (plusieurs articles par semaine) :
// - pagination en pages réelles (/blog/page/2), indexables et rapides ;
// - catégories en pages dédiées (/blog/categorie/soins), bonnes pour le SEO ;
// - recherche (/blog/recherche?q=) non indexée ; en base : recherche plein texte
//   PostgreSQL (tsvector, config « french ») plutôt qu'un LIKE.
// Index prévus en base : (status, publishedAt), (categoryId, publishedAt), slug unique.

import {
  categoriesPlaceholder,
  postsPlaceholder,
} from "@/content/posts.placeholder"
import type { RichTextDoc } from "@/lib/rich-text"

export const POSTS_PER_PAGE = 6

export type CategoryIcon = "sparkles" | "heart" | "leaf" | "feather" | "lightbulb" | "lotus"

export type BlogCategory = {
  slug: string
  name: string
  /** Icône choisie dans l'admin (liste fermée, voir category-icon.tsx). */
  icon: CategoryIcon
}

export type PostSummary = {
  slug: string
  title: string
  category: BlogCategory
  /** Date ISO de publication. */
  publishedAt: string
  /** Calculé à l'enregistrement à partir du nombre de mots. */
  readingMinutes: number
  coverAlt: string
  /** Vrai tant que l'article n'a pas de page (données de démonstration). */
  placeholder?: boolean
}

export type BlogTag = { slug: string; name: string }

// Article complet (page /blog/[slug]).
export type PostDetail = PostSummary & {
  /** Chapô : introduction affichée sous l'image et meta description par défaut. */
  excerpt: string
  content: RichTextDoc
  tags: BlogTag[]
  updatedAt?: string
  /** Réglages SEO de l'admin (sinon : titre et chapô). */
  seo?: { title?: string; description?: string }
}

export type CategoryWithCount = BlogCategory & { count: number }

export type Paginated<T> = {
  items: T[]
  page: number
  totalPages: number
  total: number
}

// Articles publiés, du plus récent au plus ancien.
// Prisma : where { status: "PUBLISHED", publishedAt: { lte: new Date() } }, orderBy { publishedAt: "desc" }.
function publishedPosts() {
  return [...postsPlaceholder].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

function isPostDetail(post: (typeof postsPlaceholder)[number]): post is (typeof postsPlaceholder)[number] & PostDetail {
  return "content" in post && Boolean(post.content)
}

// Ne garde que les champs d'une carte (ni contenu, ni compteur de vues).
function toSummary(post: (typeof postsPlaceholder)[number]): PostSummary {
  const { slug, title, category, publishedAt, readingMinutes, coverAlt, placeholder } = post
  return { slug, title, category, publishedAt, readingMinutes, coverAlt, placeholder }
}

export async function getCategories(): Promise<BlogCategory[]> {
  return categoriesPlaceholder
}

// Prisma : category.findMany avec _count des articles publiés.
export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  const posts = publishedPosts()
  return categoriesPlaceholder.map((category) => ({
    ...category,
    count: posts.filter((post) => post.category.slug === category.slug).length,
  }))
}

export async function getPostBySlug(slug: string): Promise<PostDetail | undefined> {
  const post = publishedPosts().find((p) => p.slug === slug)
  if (!post || !isPostDetail(post)) return undefined
  const { views, ...detail } = post
  void views
  return detail
}

/** Slugs des articles qui ont une page (génération statique / sitemap). */
export async function getPostSlugs(): Promise<string[]> {
  return publishedPosts().filter(isPostDetail).map((post) => post.slug)
}

export async function getCategory(slug: string): Promise<BlogCategory | undefined> {
  return categoriesPlaceholder.find((category) => category.slug === slug)
}

// Prisma : findMany + count avec skip/take, dans une transaction.
export async function getPosts({
  categorySlug,
  page = 1,
}: {
  categorySlug?: string
  page?: number
} = {}): Promise<Paginated<PostSummary>> {
  const all = publishedPosts().filter(
    (post) => !categorySlug || post.category.slug === categorySlug
  )
  const totalPages = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE))
  const start = (page - 1) * POSTS_PER_PAGE

  return {
    items: all.slice(start, start + POSTS_PER_PAGE).map(toSummary),
    page,
    totalPages,
    total: all.length,
  }
}

export async function getLatestPosts(limit: number, excludeSlug?: string): Promise<PostSummary[]> {
  return publishedPosts()
    .filter((post) => post.slug !== excludeSlug)
    .slice(0, limit)
    .map(toSummary)
}

// Prisma : orderBy { viewCount: "desc" } (compteur incrémenté à la lecture,
// sans cookie ni donnée personnelle).
export async function getPopularPosts(limit: number): Promise<PostSummary[]> {
  return publishedPosts()
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
    .map(toSummary)
}

// Recherche insensible aux accents et à la casse sur le titre et la catégorie.
// Synchrone car utilisée côté navigateur sur la démo statique ; en base, elle
// deviendra une requête serveur plein texte.
const normalize = (text: string) =>
  text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim()

export function searchPosts(query: string): PostSummary[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []

  return publishedPosts()
    .filter((post) => {
      const haystack = normalize(`${post.title} ${post.category.name}`)
      return terms.every((term) => haystack.includes(term))
    })
    .map(toSummary)
}

export function postHref(post: PostSummary) {
  return post.placeholder ? "/blog" : `/blog/${post.slug}`
}

// URL d'une page de liste : /blog, /blog/page/2, /blog/categorie/soins, /blog/categorie/soins/page/2.
export function blogListHref({ categorySlug, page = 1 }: { categorySlug?: string; page?: number }) {
  const base = categorySlug ? `/blog/categorie/${categorySlug}` : "/blog"
  return page > 1 ? `${base}/page/${page}` : base
}
