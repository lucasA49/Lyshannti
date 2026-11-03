import type { Metadata } from "next";

import { ArticlesList } from "@/components/admin/articles/articles-list";
import { AdminPageHeader } from "@/components/admin/page-header";
import { TRASH_RETENTION_DAYS, getAdminArticles, getAdminCategories } from "@/lib/admin/articles";

export const metadata: Metadata = {
  title: "Articles",
};

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([getAdminArticles(), getAdminCategories()]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader title="Articles" description="Écrivez, programmez et gérez les articles du blog." />
      <ArticlesList articles={articles} categories={categories} trashRetentionDays={TRASH_RETENTION_DAYS} />
    </div>
  );
}
