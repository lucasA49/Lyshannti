import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleEditor } from "@/components/admin/editor/article-editor";
import { getAdminCategories, getArticleForEdit, getPickerMedia } from "@/lib/admin/articles";
import { requireAdmin } from "@/lib/auth/session";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Modifier l'article",
};

export default async function EditArticlePage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const [article, categories, media] = await Promise.all([getArticleForEdit(id), getAdminCategories(), getPickerMedia()]);
  if (!article) notFound();

  // key : un autre article recrée l'éditeur (état propre).
  return <ArticleEditor key={article.id} categories={categories} media={media} initial={article} />;
}
