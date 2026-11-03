// Données du blog lues dans PostgreSQL (Prisma). Mêmes signatures que blog-demo.ts.
// Serveur uniquement (importé dynamiquement par blog.ts quand DATABASE_URL existe).

import type { Prisma } from "@/generated/prisma/client"
import { db } from "@/lib/db"
import {
  POSTS_PER_PAGE,
  type BlogCategory,
  type CategoryWithCount,
  type Paginated,
  type PostDetail,
  type PostSummary,
} from "@/lib/blog-types"
import type { RichTextDoc } from "@/lib/rich-text"

// Article visible sur le site : publié, date atteinte, pas à la corbeille.
const published = (): Prisma.ArticleWhereInput => ({
  status: "PUBLISHED",
  publishedAt: { lte: new Date() },
  deletedAt: null,
})

const summarySelect = {
  slug: true,
  title: true,
  publishedAt: true,
  readingMinutes: true,
  category: { select: { slug: true, name: true, icon: true } },
  cover: { select: { alt: true } },
} satisfies Prisma.ArticleSelect

type SummaryRow = Prisma.ArticleGetPayload<{ select: typeof summarySelect }>

function toSummary(row: SummaryRow): PostSummary {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    publishedAt: (row.publishedAt ?? new Date()).toISOString(),
    readingMinutes: row.readingMinutes,
    coverAlt: row.cover?.alt ?? "",
  }
}

export async function getCategories(): Promise<BlogCategory[]> {
  return db.category.findMany({
    select: { slug: true, name: true, icon: true },
    orderBy: [{ position: "asc" }, { name: "asc" }],
  })
}

export async function getCategory(slug: string): Promise<BlogCategory | undefined> {
  const category = await db.category.findUnique({ where: { slug }, select: { slug: true, name: true, icon: true } })
  return category ?? undefined
}

export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  const categories = await db.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    select: {
      slug: true,
      name: true,
      icon: true,
      _count: { select: { articles: { where: published() } } },
    },
  })
  return categories.map(({ _count, ...category }) => ({ ...category, count: _count.articles }))
}

export async function getPosts({
  categorySlug,
  page = 1,
}: {
  categorySlug?: string
  page?: number
} = {}): Promise<Paginated<PostSummary>> {
  const where: Prisma.ArticleWhereInput = {
    ...published(),
    ...(categorySlug && { category: { slug: categorySlug } }),
  }
  const [total, rows] = await db.$transaction([
    db.article.count({ where }),
    db.article.findMany({
      where,
      select: summarySelect,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
  ])

  return {
    items: rows.map(toSummary),
    page,
    totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)),
    total,
  }
}

export async function getLatestPosts(limit: number, excludeSlug?: string): Promise<PostSummary[]> {
  const rows = await db.article.findMany({
    where: { ...published(), ...(excludeSlug && { slug: { not: excludeSlug } }) },
    select: summarySelect,
    orderBy: { publishedAt: "desc" },
    take: limit,
  })
  return rows.map(toSummary)
}

export async function getPopularPosts(limit: number): Promise<PostSummary[]> {
  const rows = await db.article.findMany({
    where: published(),
    select: summarySelect,
    orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
    take: limit,
  })
  return rows.map(toSummary)
}

export async function getPostSlugs(): Promise<string[]> {
  const rows = await db.article.findMany({ where: published(), select: { slug: true } })
  return rows.map((row) => row.slug)
}

export async function getPostBySlug(slug: string): Promise<PostDetail | undefined> {
  const row = await db.article.findFirst({
    where: { ...published(), slug },
    select: {
      ...summarySelect,
      excerpt: true,
      content: true,
      updatedAt: true,
      metaTitle: true,
      metaDescription: true,
      tags: { select: { tag: { select: { slug: true, name: true } } } },
    },
  })
  if (!row) return undefined

  return {
    ...toSummary(row),
    excerpt: row.excerpt,
    content: row.content as unknown as RichTextDoc,
    tags: row.tags.map(({ tag }) => tag),
    updatedAt: row.updatedAt.toISOString(),
    seo: { title: row.metaTitle ?? undefined, description: row.metaDescription ?? undefined },
  }
}

// Recherche serveur (titre et chapô, insensible à la casse).
// À faire évoluer : recherche plein texte PostgreSQL « french » (accents, pluriels).
export async function searchPosts(query: string): Promise<PostSummary[]> {
  const terms = query.trim().split(/\s+/).filter(Boolean).slice(0, 8)
  if (terms.length === 0) return []
  const rows = await db.article.findMany({
    where: {
      ...published(),
      AND: terms.map((term) => ({
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { excerpt: { contains: term, mode: "insensitive" } },
        ],
      })),
    },
    select: summarySelect,
    orderBy: { publishedAt: "desc" },
    take: 30,
  })
  return rows.map(toSummary)
}
