import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pageMetadata } from "@/lib/seo";
import { BlogListPage } from "@/components/blog/blog-list-page";
import { blogListHref } from "@/lib/blog-urls"
import { getCategories, getCategory, getPosts } from "@/lib/blog";

type Props = { params: Promise<{ slug: string; page: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  const params: { slug: string; page: string }[] = [];
  for (const category of await getCategories()) {
    const { totalPages } = await getPosts({ categorySlug: category.slug });
    for (let page = 2; page <= totalPages; page++) {
      params.push({ slug: category.slug, page: String(page) });
    }
  }
  return params;
}

async function resolve(params: Props["params"]) {
  const { slug, page: rawPage } = await params;
  const page = Number(rawPage);
  const category = await getCategory(slug);
  if (!category || !Number.isInteger(page) || page < 2) notFound();
  return { category, page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, page } = await resolve(params);
  return pageMetadata({
    title: `${category.name} – articles du blog, page ${page}`,
    description: `Tous nos articles « ${category.name} » : conseils et inspiration pour prendre soin de vous au quotidien.`,
    path: blogListHref({ categorySlug: category.slug, page }),
  });
}

export default async function BlogCategoryPaginatedPage({ params }: Props) {
  const { category, page } = await resolve(params);
  return <BlogListPage categorySlug={category.slug} page={page} />;
}
