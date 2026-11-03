import Link from "next/link"
import { cn } from "cn"

import { CategoryIcon } from "@/components/blog/category-icon"
import { SidebarTitle, sidebarCardClass } from "@/components/blog/blog-sidebar"
import { blogListHref } from "@/lib/blog-urls"
import type { CategoryWithCount } from "@/lib/blog-types"

// Liste des catégories avec le nombre d'articles (colonne latérale d'un article).
function CategoriesCard({
  categories,
  activeSlug,
}: {
  categories: CategoryWithCount[]
  activeSlug?: string
}) {
  const total = categories.reduce((sum, category) => sum + category.count, 0)
  const items = [
    { slug: undefined, name: "Tous les articles", icon: "lotus" as const, count: total },
    ...categories.filter((category) => category.count > 0),
  ]

  return (
    <section aria-labelledby="categories-title" className={sidebarCardClass}>
      <SidebarTitle id="categories-title">Catégories</SidebarTitle>
      <ul className="mt-4 divide-y divide-plum/10">
        {items.map((item) => {
          const active = item.slug === activeSlug
          return (
            <li key={item.slug ?? "tous"} className="py-1">
              <Link
                href={blogListHref({ categorySlug: item.slug })}
                className={cn(
                  "flex items-center gap-3 rounded-full px-3 py-2 text-plum outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                  active ? "bg-plum text-blush [&_svg]:text-gold" : "hover:bg-blush [&_svg]:text-plum/70"
                )}
              >
                <CategoryIcon name={item.icon} />
                <span className="flex-1">{item.name}</span>
                <span className={cn("text-sm", active ? "text-blush/80" : "text-plum/60")}>
                  ({item.count})
                  <span className="sr-only"> articles</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export { CategoriesCard }
