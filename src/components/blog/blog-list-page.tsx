import { notFound } from "next/navigation"

import { BlogShell, PostGrid } from "@/components/blog/blog-shell"
import { Pagination } from "@/components/blog/pagination"
import { getCategories, getCategory, getPopularPosts, getPosts } from "@/lib/blog"

export const BLOG_DESCRIPTION =
  "Retrouvez nos articles, astuces et conseils pour prendre soin de vous, naturellement et au quotidien."

// Rendu d'une page de liste : /blog, /blog/page/n, /blog/categorie/x(/page/n).
async function BlogListPage({ categorySlug, page = 1 }: { categorySlug?: string; page?: number }) {
  const category = categorySlug ? await getCategory(categorySlug) : undefined
  if (categorySlug && !category) notFound()

  const [posts, categories, popularPosts] = await Promise.all([
    getPosts({ categorySlug, page }),
    getCategories(),
    getPopularPosts(3),
  ])
  if (page > posts.totalPages) notFound()

  const pageSuffix = page > 1 ? ` – page ${page}` : ""

  return (
    <BlogShell
      title={
        category ? (
          category.name
        ) : (
          <>
            Conseils, inspiration{" "}
            <br className="hidden sm:block" />
            et bien-être
          </>
        )
      }
      description={BLOG_DESCRIPTION}
      sectionTitle={`${category ? "Articles" : "Nos derniers articles"}${pageSuffix}`}
      categories={categories}
      activeCategorySlug={categorySlug}
      popularPosts={popularPosts}
    >
      <PostGrid posts={posts.items} />
      <Pagination page={page} totalPages={posts.totalPages} categorySlug={categorySlug} />
    </BlogShell>
  )
}

export { BlogListPage }
