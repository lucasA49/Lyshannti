import Link from "next/link"
import { ChevronRight, House } from "lucide-react"

import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/config/site"
import { frenchTypo } from "@/lib/format"

export type BreadcrumbItem = { label: string; href?: string }

// Fil d'Ariane visible + données structurées BreadcrumbList pour Google.
// Le dernier élément (page courante) n'est pas un lien.
function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const all = [{ label: "Accueil", href: "/" }, ...items]

  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-plum/75">
        {all.map((item, index) => {
          const last = index === all.length - 1
          return (
            <li key={index} className="inline-flex items-center gap-2">
              {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 text-plum/50" />}
              {item.href && !last ? (
                <Link href={item.href} className="inline-flex items-center gap-1.5 rounded-sm outline-none hover:text-plum hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
                  {index === 0 && <House aria-hidden="true" className="size-4" />}
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="line-clamp-1 text-plum">
                  {frenchTypo(item.label)}
                </span>
              )}
            </li>
          )
        })}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            ...(item.href && { item: `${siteConfig.url}${item.href === "/" ? "/" : `${item.href}/`}` }),
          })),
        }}
      />
    </nav>
  )
}

export { Breadcrumb }
