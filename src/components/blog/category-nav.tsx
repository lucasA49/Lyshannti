import Link from "next/link"
import { cn } from "cn"

import { CategoryIcon } from "@/components/blog/category-icon"
import { blogListHref } from "@/lib/blog-urls"
import type { BlogCategory } from "@/lib/blog-types"

// Filtres par catégorie : de vrais liens vers des pages indexables.
// Sur mobile, la rangée défile horizontalement.
function CategoryNav({
  categories,
  activeSlug,
  allActive = true,
}: {
  categories: BlogCategory[]
  activeSlug?: string
  /** « Tous les articles » actif quand aucune catégorie n'est choisie (faux sur la recherche). */
  allActive?: boolean
}) {
  const items = [
    { slug: undefined, name: "Tous les articles", icon: "lotus" as const },
    ...categories,
  ]

  return (
    <nav aria-label="Catégories du blog">
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
        {items.map((item) => {
          const active = item.slug ? item.slug === activeSlug : !activeSlug && allActive
          return (
            <li key={item.slug ?? "tous"} className="shrink-0 snap-start">
              <Link
                href={blogListHref({ categorySlug: item.slug })}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "border-plum bg-plum text-blush [&_svg]:text-gold"
                    : "border-gold/40 bg-white/70 text-plum hover:border-plum [&_svg]:text-plum/70"
                )}
              >
                <CategoryIcon name={item.icon} />
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export { CategoryNav }
