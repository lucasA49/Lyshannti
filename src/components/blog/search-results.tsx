"use client"

import { useSearchParams } from "next/navigation"

import { PostGrid } from "@/components/blog/blog-shell"
import { searchPosts } from "@/lib/blog-demo"

// Résultats de recherche lus dans l'URL (?q=). Côté navigateur pour la démo
// statique ; avec la base, la page lira `searchParams` côté serveur.
function SearchResults() {
  const query = (useSearchParams().get("q") ?? "").slice(0, 100)
  const results = searchPosts(query)

  if (!query.trim()) {
    return <p className="text-center text-plum/80">Saisissez un mot-clé pour lancer la recherche.</p>
  }

  return (
    <>
      <p role="status" className="mb-6 text-center text-plum/80">
        {results.length === 0
          ? `Aucun article ne correspond à « ${query} ».`
          : `${results.length} article${results.length > 1 ? "s" : ""} pour « ${query} »`}
      </p>
      {results.length > 0 && <PostGrid posts={results} />}
    </>
  )
}

export { SearchResults }
