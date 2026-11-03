import type { Metadata } from "next";
import { Suspense } from "react";

import { BlogShell, PostGrid } from "@/components/blog/blog-shell";
import { BLOG_DESCRIPTION } from "@/components/blog/blog-list-page";
import { SearchResults } from "@/components/blog/search-results";
import { getCategories, getPopularPosts, searchPostsOnServer, usesDatabase } from "@/lib/blog";

// Pages de résultats : jamais indexées (contenu en double, URL infinies).
export const metadata: Metadata = {
  title: "Recherche dans le blog",
  description: BLOG_DESCRIPTION,
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ q?: string | string[] }> };

// Avec la base : recherche côté serveur. Démo statique : recherche dans le navigateur.
async function ServerResults({ searchParams }: Props) {
  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : raw ?? "").slice(0, 100);
  if (!query.trim()) {
    return <p className="text-center text-plum/80">Saisissez un mot-clé pour lancer la recherche.</p>;
  }
  const results = await searchPostsOnServer(query);
  return (
    <>
      <p role="status" className="mb-6 text-center text-plum/80">
        {results.length === 0
          ? `Aucun article ne correspond à « ${query} ».`
          : `${results.length} article${results.length > 1 ? "s" : ""} pour « ${query} »`}
      </p>
      {results.length > 0 && <PostGrid posts={results} />}
    </>
  );
}

export default async function BlogSearchPage({ searchParams }: Props) {
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
        {usesDatabase ? <ServerResults searchParams={searchParams} /> : <SearchResults />}
      </Suspense>
    </BlogShell>
  );
}
