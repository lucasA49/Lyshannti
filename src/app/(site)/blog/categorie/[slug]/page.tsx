import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pageMetadata } from "@/lib/seo";
import { BlogListPage } from "@/components/blog/blog-list-page";
import { blogListHref } from "@/lib/blog-urls"
import { getCategories, getCategory } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

// Régénérée au plus toutes les 5 minutes : les articles programmés y apparaissent
// sans republication (et immédiatement après chaque action dans l'admin).
export const revalidate = 300;

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  return pageMetadata({
    title: `${category.name} – articles du blog`,
    description: `Tous nos articles « ${category.name} » : conseils et inspiration pour prendre soin de vous au quotidien.`,
    path: blogListHref({ categorySlug: slug }),
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  return <BlogListPage categorySlug={(await params).slug} />;
}
