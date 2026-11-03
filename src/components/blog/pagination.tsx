import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "cn"

import { blogListHref } from "@/lib/blog-urls"

// Numéros affichés : première, dernière, et deux voisines de la page courante,
// avec « … » entre les trous (ex. 1 … 4 5 6 … 20).
function pageNumbers(page: number, totalPages: number) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b)
  const result: (number | "…")[] = []
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) result.push("…")
    result.push(n)
  })
  return result
}

const itemClass =
  "inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-full border px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"

function Pagination({
  page,
  totalPages,
  categorySlug,
}: {
  page: number
  totalPages: number
  categorySlug?: string
}) {
  if (totalPages <= 1) return null
  const href = (n: number) => blogListHref({ categorySlug, page: n })

  return (
    <nav aria-label="Pagination" className="mt-10">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 && (
          <li>
            <Link href={href(page - 1)} rel="prev" className={cn(itemClass, "border-gold/40 bg-white/70 text-plum hover:border-plum")}>
              <ChevronLeft className="size-4" aria-hidden="true" />
              Précédent
            </Link>
          </li>
        )}
        {pageNumbers(page, totalPages).map((n, i) =>
          n === "…" ? (
            <li key={`ellipsis-${i}`} aria-hidden="true" className="px-1 text-plum/60">
              …
            </li>
          ) : (
            <li key={n}>
              <Link
                href={href(n)}
                aria-label={`Page ${n}`}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  itemClass,
                  n === page
                    ? "border-plum bg-plum text-blush"
                    : "border-gold/40 bg-white/70 text-plum hover:border-plum"
                )}
              >
                {n}
              </Link>
            </li>
          )
        )}
        {page < totalPages && (
          <li>
            <Link href={href(page + 1)} rel="next" className={cn(itemClass, "border-gold/40 bg-white/70 text-plum hover:border-plum")}>
              Suivant
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export { Pagination }
