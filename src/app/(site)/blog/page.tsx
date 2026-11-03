import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { BLOG_DESCRIPTION, BlogListPage } from "@/components/blog/blog-list-page";

// Régénérée au plus toutes les 5 minutes : les articles programmés y apparaissent
// sans republication (et immédiatement après chaque action dans l'admin).
export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Le blog : conseils, inspiration et bien-être",
  description: BLOG_DESCRIPTION,
  path: "/blog",
});

export default function BlogPage() {
  return <BlogListPage />;
}
