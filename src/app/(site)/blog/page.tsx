import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { BLOG_DESCRIPTION, BlogListPage } from "@/components/blog/blog-list-page";

export const metadata: Metadata = pageMetadata({
  title: "Le blog : conseils, inspiration et bien-être",
  description: BLOG_DESCRIPTION,
  path: "/blog",
});

export default function BlogPage() {
  return <BlogListPage />;
}
