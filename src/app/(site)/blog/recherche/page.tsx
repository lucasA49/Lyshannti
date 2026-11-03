import type { Metadata } from "next";
import { Suspense } from "react";

import { BlogShell } from "@/components/blog/blog-shell";
import { BLOG_DESCRIPTION } from "@/components/blog/blog-list-page";
import { SearchResults } from "@/components/blog/search-results";
import { getCategories, getPopularPosts } from "@/lib/blog";

// Pages de résultats : jamais indexées (contenu en double, URL infinies).
export const metadata: Metadata = {
  title: "Recherche dans le blog",
  description: BLOG_DESCRIPTION,
  robots: { index: false, follow: true },
};

export default async function BlogSearchPage() {
  const [categories, popularPosts] = await Promise.all([getCategories(), getPopularPosts(3)]);

  return (
    <BlogShell
      title="Recherche"
      description={BLOG_DESCRIPTION}
      sectionTitle="Résultats de recherche"
      categories={categories}
      popularPosts={popularPosts}
      isSearch
    >
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </BlogShell>
  );
}
