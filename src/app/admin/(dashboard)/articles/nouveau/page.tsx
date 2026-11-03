import type { Metadata } from "next";

import { ArticleEditor } from "@/components/admin/editor/article-editor";
import { getAdminCategories, getPickerMedia } from "@/lib/admin/articles";

export const metadata: Metadata = {
  title: "Nouvel article",
};

export default async function NewArticlePage() {
  const [categories, media] = await Promise.all([getAdminCategories(), getPickerMedia()]);
  return <ArticleEditor categories={categories} media={media} />;
}
