import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/page-header";
import { TaxonomyManager } from "@/components/admin/taxonomy/taxonomy-manager";
import { categoryIconChoices, getAdminTaxonomy } from "@/lib/admin/taxonomy";

export const metadata: Metadata = {
  title: "Catégories et tags",
};

export default async function AdminTaxonomyPage() {
  const { categories, tags } = await getAdminTaxonomy();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader title="Catégories et tags" description="Organisez les articles du blog." />
      <TaxonomyManager categories={categories} tags={tags} icons={categoryIconChoices} />
    </div>
  );
}
