import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { PostCard } from "@/components/blog/post-card"
import { Container } from "@/components/layout/container"
import { SectionTitle } from "@/components/layout/section-title"
import { latestPostsPlaceholder } from "@/content/posts.placeholder"

function LatestPosts() {
  // Provisoire : sera remplacé par les 3 derniers articles publiés (Prisma).
  const posts = latestPostsPlaceholder

  return (
    <section aria-labelledby="latest-posts-title" className="py-16 sm:py-20">
      <Container>
        <SectionTitle
          id="latest-posts-title"
          title="Derniers articles du blog"
          subtitle="Conseils, astuces et actualités pour prendre soin de vous au quotidien."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="flex *:flex-1 sm:last:col-span-2 sm:last:mx-auto sm:last:w-[calc(50%-0.75rem)] lg:last:col-span-1 lg:last:w-auto"
            >
              <PostCard post={post} />
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "outline-plum", size: "cta" }),
              "border-gold hover:border-plum"
            )}
          >
            Voir tous les articles
            <ArrowRight />
          </Link>
        </div>
      </Container>
    </section>
  )
}

export { LatestPosts }
