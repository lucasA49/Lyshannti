import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { blogListHref, getCategories, getPostBySlug, getPosts, getPostSlugs } from "@/lib/blog";

export const dynamic = "force-static";

// Pages publiques fixes.
const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/prestations", priority: 0.9 },
  { path: "/a-propos", priority: 0.7 },
  { path: "/blog", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  { path: "/mentions-legales", priority: 0.2 },
  { path: "/politique-de-confidentialite", priority: 0.2 },
  { path: "/cookies", priority: 0.2 },
];

const toUrl = (path: string) => `${siteConfig.url}${path === "/" ? "/" : `${path}/`}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = routes.map(({ path, priority }) => ({
    url: toUrl(path),
    changeFrequency: path === "/blog" ? "weekly" : "monthly",
    priority,
  }));

  // Pages de catégories du blog qui contiennent des articles.
  const categories = await getCategories();
  const categoryPages = await Promise.all(
    categories.map(async (category) => {
      const { total } = await getPosts({ categorySlug: category.slug });
      return total > 0
        ? { url: toUrl(blogListHref({ categorySlug: category.slug })), changeFrequency: "weekly" as const, priority: 0.5 }
        : null;
    })
  );

  // Articles, avec leur date de dernière modification.
  const slugs = await getPostSlugs();
  const articles = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getPostBySlug(slug);
      return {
        url: toUrl(`/blog/${slug}`),
        lastModified: post?.updatedAt ?? post?.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    })
  );

  return [...pages, ...categoryPages.filter((page) => page !== null), ...articles];
}
