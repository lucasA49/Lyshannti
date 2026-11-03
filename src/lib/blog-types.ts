// Types du blog, partagés par les sources de données et les composants
// (y compris « use client » : aucun accès aux données ici).

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
