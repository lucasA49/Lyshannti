import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pageMetadata } from "@/lib/seo";
import { BLOG_DESCRIPTION, BlogListPage } from "@/components/blog/blog-list-page";
import { blogListHref } from "@/lib/blog-urls"
import { getPosts } from "@/lib/blog";

type Props = { params: Promise<{ page: string }> };

// Pages 2, 3… générées au build, puis à la demande quand le blog grandit ;
// revalidées à chaque publication depuis l'admin (revalidatePath).
export const dynamicParams = true;

export async function generateStaticParams() {
  const { totalPages } = await getPosts();
  return Array.from({ length: totalPages - 1 }, (_, i) => ({ page: String(i + 2) }));
}

function parsePage(value: string) {
  const page = Number(value);
  if (!Number.isInteger(page) || page < 2) notFound();
  return page;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parsePage((await params).page);
  return pageMetadata({
    title: `Le blog – page ${page}`,
    description: BLOG_DESCRIPTION,
    path: blogListHref({ page }),
  });
}

export default async function BlogPaginatedPage({ params }: Props) {
  return <BlogListPage page={parsePage((await params).page)} />;
}
