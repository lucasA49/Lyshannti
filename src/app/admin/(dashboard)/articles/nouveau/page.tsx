import type { Metadata } from "next";

import { ArticleEditor } from "@/components/admin/editor/article-editor";
import { getAdminCategories } from "@/lib/admin/articles";

export const metadata: Metadata = {
  title: "Nouvel article",
};

export default async function NewArticlePage() {
  const categories = await getAdminCategories();
  return <ArticleEditor categories={categories} />;
}
