import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";

import { CategoriesCard } from "@/components/blog/categories-card";
import { SearchCard, SidebarPostList } from "@/components/blog/blog-sidebar";
import { RichText } from "@/components/blog/rich-text";
import { ShareButtons } from "@/components/blog/share-buttons";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { siteConfig } from "@/config/site";
import { blogListHref } from "@/lib/blog-urls"
import { getCategoriesWithCount, getLatestPosts, getPostBySlug, getPostSlugs } from "@/lib/blog";
import { formatPostDateLong, frenchTypo } from "@/lib/format";
import { ogImage, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Articles générés au build ; un article publié ensuite est rendu à sa première
// visite, et chaque modification dans l'admin régénère la page (revalidatePath).
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();

  const metadata = pageMetadata({
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    path: `/blog/${post.slug}`,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      section: post.category.name,
      tags: post.tags.map((tag) => tag.name),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();

  const [categories, recentPosts] = await Promise.all([
    getCategoriesWithCount(),
    getLatestPosts(3, post.slug),
  ]);
  const url = `${siteConfig.url}/blog/${post.slug}/`;

  return (
    <main id="contenu" className="flex-1 bg-linear-to-b from-blush/40 to-blush/60">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          articleSection: post.category.name,
          keywords: post.tags.map((tag) => tag.name).join(", "),
          inLanguage: "fr-FR",
          mainEntityOfPage: url,
          image: `${siteConfig.url}${ogImage.url}`,
          author: { "@type": "Organization", name: siteConfig.name, url: `${siteConfig.url}/` },
          publisher: { "@id": `${siteConfig.url}/#organization` },
        }}
      />

      <Container className="py-8 sm:py-10">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: post.category.name, href: blogListHref({ categorySlug: post.category.slug }) },
            { label: post.title },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-x-10">
          <article aria-labelledby="article-title" className="min-w-0">
            <header>
              <Link
                href={blogListHref({ categorySlug: post.category.slug })}
                className="inline-flex rounded-full bg-blush px-3 py-1 text-sm font-semibold text-plum outline-none hover:bg-gold/40 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {post.category.name}
              </Link>
              <h1
                id="article-title"
                className="mt-3 font-heading text-3xl leading-tight font-semibold text-plum italic sm:text-4xl lg:text-[2.75rem]"
              >
                {frenchTypo(post.title)}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-plum/75">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays aria-hidden="true" className="size-4 text-plum/60" />
                  <time dateTime={post.publishedAt}>{formatPostDateLong(post.publishedAt)}</time>
                </span>
                <span aria-hidden="true" className="hidden h-4 w-px bg-plum/20 sm:block" />
                <span className="inline-flex items-center gap-2">
                  <Clock aria-hidden="true" className="size-4 text-plum/60" />
                  {post.readingMinutes} min de lecture
                </span>
              </div>
            </header>

            <div className="mt-6 overflow-hidden rounded-3xl border border-gold/25 shadow-md shadow-plum/10">
              <ImagePlaceholder label={post.coverAlt} className="aspect-16/9 sm:aspect-2/1" />
            </div>

            <p className="mt-6 text-lg leading-relaxed font-medium text-plum">{frenchTypo(post.excerpt)}</p>

            <RichText doc={post.content} />

            <footer className="mt-10 flex flex-col gap-6 border-t border-plum/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <ShareButtons url={url} title={post.title} />
              {post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-heading text-lg font-semibold text-plum">Tags&nbsp;:</p>
                  <ul className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li key={tag.slug} className="rounded-full border border-gold/40 bg-white/70 px-3 py-1 text-sm text-plum">
                        {tag.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </footer>
          </article>

          <aside aria-label="Autour de l'article" className="flex flex-col gap-6">
            <SearchCard />
            <CategoriesCard categories={categories} activeSlug={post.category.slug} />
            <SidebarPostList id="recent-title" title="Articles récents" posts={recentPosts} />
          </aside>
        </div>
      </Container>
    </main>
  );
}
