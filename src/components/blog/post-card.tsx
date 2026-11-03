import Link from "next/link"
import { ArrowRight, CalendarDays } from "lucide-react"

import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import type { PostPreview } from "@/content/posts.placeholder"

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function PostCard({ post }: { post: PostPreview }) {
  return (
    // Toute la carte est cliquable grâce au lien étiré (after:absolute) du titre.
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold/25 bg-white/70 shadow-lg shadow-plum/5 transition-shadow focus-within:ring-3 focus-within:ring-ring/60 hover:shadow-xl hover:shadow-plum/10">
      <div className="relative">
        <ImagePlaceholder label={post.coverAlt} className="aspect-16/9" />
        <span className="absolute bottom-0 left-4 translate-y-1/2 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-plum shadow-sm">
          {post.category.name}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 pt-6">
        <h3 className="flex-1 font-heading text-xl font-semibold text-plum">
          <Link
            href={`/blog/${post.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {post.title}
          </Link>
        </h3>
        <div className="flex items-center justify-between text-sm text-plum/70">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 text-gold" aria-hidden="true" />
            <time dateTime={post.publishedAt}>
              {dateFormat.format(new Date(post.publishedAt))}
            </time>
          </span>
          <ArrowRight
            aria-hidden="true"
            className="size-5 text-plum transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </article>
  )
}

export { PostCard }
