import Link from "next/link"
import { CalendarDays } from "lucide-react"

import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { SearchForm } from "@/components/blog/search-form"
import { postHref, type PostSummary } from "@/lib/blog"
import { formatPostDate, frenchTypo } from "@/lib/format"

function SidebarTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-3 font-heading text-2xl font-semibold text-plum">
      <span aria-hidden="true" className="h-0.5 w-6 shrink-0 rounded-full bg-gold" />
      {children}
    </h2>
  )
}

const cardClass =
  "rounded-3xl border border-gold/25 bg-white/70 p-5 shadow-sm shadow-plum/5 sm:p-6"

function SearchCard({ defaultValue }: { defaultValue?: string }) {
  return (
    <section aria-labelledby="search-title" className={cardClass}>
      <SidebarTitle id="search-title">Rechercher un article</SidebarTitle>
      <div className="mt-4">
        <SearchForm defaultValue={defaultValue} />
      </div>
    </section>
  )
}

function SidebarPostList({
  id,
  title,
  posts,
}: {
  id: string
  title: string
  posts: PostSummary[]
}) {
  return (
    <section aria-labelledby={id} className={cardClass}>
      <SidebarTitle id={id}>{title}</SidebarTitle>
      <ol className="mt-4 divide-y divide-plum/10">
        {posts.map((post) => (
          <li key={post.slug} className="group relative flex items-center gap-4 py-3 first:pt-0 last:pb-0">
            <div className="w-24 shrink-0 overflow-hidden rounded-xl">
              <ImagePlaceholder label={post.coverAlt} className="aspect-4/3 [&_span]:hidden" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-base leading-snug font-semibold text-plum">
                <Link
                  href={postHref(post)}
                  className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:ring-3 focus-visible:ring-ring/50 group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4"
                >
                  {frenchTypo(post.title)}
                </Link>
              </h3>
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-plum/75">
                <CalendarDays className="size-4 text-plum/60" aria-hidden="true" />
                <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export { SearchCard, SidebarPostList, SidebarTitle, cardClass as sidebarCardClass }
