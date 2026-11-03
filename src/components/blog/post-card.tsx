import Link from "next/link"
import { CalendarDays, Clock } from "lucide-react"

import { CoverImage } from "@/components/blog/cover-image"
import { postHref } from "@/lib/blog-urls"
import type { PostSummary } from "@/lib/blog-types"
import { formatPostDate, frenchTypo } from "@/lib/format"

function PostCard({
  post,
  headingLevel: Heading = "h3",
}: {
  post: PostSummary
  headingLevel?: "h2" | "h3"
}) {
  return (
    // Toute la carte est cliquable grâce au lien étiré (after:absolute) du titre.
    <article className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-gold/25 bg-white/70 shadow-lg shadow-plum/5 transition-shadow focus-within:ring-3 focus-within:ring-ring/60 hover:shadow-xl hover:shadow-plum/10">
      <div className="relative">
        <CoverImage url={post.coverUrl} alt={post.coverAlt} sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw" className="aspect-16/9" />
        <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-plum shadow-sm">
          {post.category.name}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <Heading className="flex-1 font-heading text-xl leading-snug font-semibold text-plum">
          <Link
            href={postHref(post)}
            className="outline-none after:absolute after:inset-0 group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4"
          >
            {frenchTypo(post.title)}
          </Link>
        </Heading>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-plum/75">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 text-plum/60" aria-hidden="true" />
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-plum/60" aria-hidden="true" />
            {post.readingMinutes} min de lecture
          </span>
        </div>
      </div>
    </article>
  )
}

export { PostCard }
