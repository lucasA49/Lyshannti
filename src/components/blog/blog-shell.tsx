import { CategoryNav } from "@/components/blog/category-nav"
import { SearchCard, SidebarPostList } from "@/components/blog/blog-sidebar"
import { PostCard } from "@/components/blog/post-card"
import { Container } from "@/components/layout/container"
import { SectionTitle } from "@/components/layout/section-title"
import { SplitHero } from "@/components/layout/split-hero"
import type { BlogCategory, PostSummary } from "@/lib/blog"

// Gabarit commun des pages de liste du blog (tous les articles, catégories,
// pagination, recherche) : en-tête, filtres, liste et colonne latérale.
// Ordre mobile : recherche, liste, articles populaires.
function BlogShell({
  title,
  description,
  sectionTitle,
  categories,
  activeCategorySlug,
  popularPosts,
  searchDefault,
  isSearch = false,
  children,
}: {
  title: React.ReactNode
  description: string
  sectionTitle: string
  categories: BlogCategory[]
  activeCategorySlug?: string
  popularPosts: PostSummary[]
  searchDefault?: string
  isSearch?: boolean
  children: React.ReactNode
}) {
  return (
    <main id="contenu" className="flex-1 bg-linear-to-b from-blush/40 to-blush/60">
      <SplitHero
        id="blog-title"
        eyebrow="Blog"
        title={title}
        description={description}
        imageLabel="Bougie dorée, lys rose, galets et flacon d'huile"
      />

      <Container className="py-10 sm:py-12">
        <CategoryNav categories={categories} activeSlug={activeCategorySlug} allActive={!isSearch} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_1fr] lg:gap-x-10">
          <div className="lg:col-start-2 lg:row-start-1">
            <SearchCard defaultValue={searchDefault} />
          </div>

          <section aria-labelledby="posts-title" className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <SectionTitle id="posts-title" title={sectionTitle} />
            <div className="mt-8">{children}</div>
          </section>

          <div className="lg:col-start-2 lg:row-start-2">
            <SidebarPostList id="popular-title" title="Articles populaires" posts={popularPosts} />
          </div>
        </div>
      </Container>
    </main>
  )
}

function PostGrid({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) {
    return (
      <p className="rounded-3xl border border-gold/25 bg-white/60 p-8 text-center text-plum/80">
        Aucun article pour le moment. Revenez bientôt&nbsp;!
      </p>
    )
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {posts.map((post) => (
        <li key={post.slug} className="flex">
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  )
}

export { BlogShell, PostGrid }
