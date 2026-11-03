// Adresses du blog. Fichier sans accès aux données : utilisable partout,
// y compris dans les composants « use client ».

import type { PostSummary } from "@/lib/blog-types"

export function postHref(post: Pick<PostSummary, "slug" | "placeholder">) {
  return post.placeholder ? "/blog" : `/blog/${post.slug}`
}

// URL d'une page de liste : /blog, /blog/page/2, /blog/categorie/soins, /blog/categorie/soins/page/2.
export function blogListHref({ categorySlug, page = 1 }: { categorySlug?: string; page?: number }) {
  const base = categorySlug ? `/blog/categorie/${categorySlug}` : "/blog"
  return page > 1 ? `${base}/page/${page}` : base
}
