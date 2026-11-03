// Lectures de l'admin dans PostgreSQL (Prisma). Serveur uniquement, chargé à la
// demande par les modules src/lib/admin/*.ts quand DATABASE_URL existe.
// TODO backend : chaque lecture passera après la vérification de la session admin.

import type { AdminArticle } from "@/lib/admin/articles"
import type { ContactRecord } from "@/lib/admin/contacts"
import type { DashboardData, SeoIssue } from "@/lib/admin/dashboard"
import type { MediaItem } from "@/lib/admin/media"
import type { SiteSettings } from "@/components/admin/settings/settings-form"
import type { AdminCategory, AdminTag } from "@/lib/admin/taxonomy"
import { db } from "@/lib/db"
import type { RichTextDoc, RichTextNode } from "@/lib/rich-text"

const DAY = 24 * 60 * 60 * 1000

// Points SEO manquants d'un article (mêmes règles que l'éditeur).
function seoIssuesOf(article: {
  metaDescription: string | null
  focusKeyword: string | null
  coverId: string | null
  content: unknown
}): SeoIssue[] {
  const issues: SeoIssue[] = []
  if (!article.metaDescription) issues.push("metaDescription")
  if (!article.coverId) issues.push("coverImage")
  if (!article.focusKeyword) issues.push("focusKeyword")

  let missingAlt = false
  const walk = (node: RichTextNode) => {
    if ((node.type === "image" || node.type === "mediaText") && !String(node.attrs?.alt ?? "").trim()) missingAlt = true
    node.content?.forEach(walk)
  }
  ;((article.content as RichTextDoc | null)?.content ?? []).forEach(walk)
  if (missingAlt) issues.push("imageAlt")
  return issues
}

const seoFields = { metaDescription: true, focusKeyword: true, coverId: true, content: true } as const

export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const notDeleted = { deletedAt: null }

  const [admin, newContacts, publishedPosts, publishedThisMonth, drafts, scheduled, recentContacts, recentPosts, topPosts, seoRows] =
    await Promise.all([
      db.user.findFirst({ select: { name: true, email: true }, orderBy: { createdAt: "asc" } }),
      db.contact.count({ where: { status: "NEW" } }),
      db.article.count({ where: { ...notDeleted, status: "PUBLISHED" } }),
      db.article.count({ where: { ...notDeleted, status: "PUBLISHED", publishedAt: { gte: monthStart } } }),
      db.article.count({ where: { ...notDeleted, status: "DRAFT" } }),
      db.article.findMany({
        where: { ...notDeleted, status: "SCHEDULED", publishedAt: { not: null } },
        select: { id: true, title: true, publishedAt: true },
        orderBy: { publishedAt: "asc" },
      }),
      db.contact.findMany({
        select: { id: true, name: true, subject: true, createdAt: true, status: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.article.findMany({
        where: notDeleted,
        select: { id: true, title: true, status: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      db.article.findMany({
        where: { ...notDeleted, status: "PUBLISHED" },
        select: { id: true, title: true, viewCount: true },
        orderBy: { viewCount: "desc" },
        take: 5,
      }),
      db.article.findMany({ where: notDeleted, select: { id: true, title: true, ...seoFields }, orderBy: { updatedAt: "desc" } }),
    ])

  const inTwoWeeks = now.getTime() + 14 * DAY

  return {
    isDemo: false,
    admin: admin ?? { name: "Administratrice", email: "" },
    stats: {
      newContacts,
      publishedPosts,
      publishedThisMonth,
      drafts,
      scheduled: scheduled.length,
      nextScheduled: scheduled[0] && { title: scheduled[0].title, publishedAt: scheduled[0].publishedAt!.toISOString() },
    },
    recentContacts: recentContacts.map((contact) => ({ ...contact, createdAt: contact.createdAt.toISOString() })),
    recentPosts: recentPosts.map((post) => ({ ...post, updatedAt: post.updatedAt.toISOString() })),
    upcoming: scheduled
      .filter((post) => post.publishedAt!.getTime() <= inTwoWeeks)
      .map((post) => ({ id: post.id, title: post.title, publishedAt: post.publishedAt!.toISOString() })),
    topPosts: topPosts.map((post) => ({ id: post.id, title: post.title, views: post.viewCount })),
    seoIssues: seoRows
      .map((row) => ({ id: row.id, title: row.title, issues: seoIssuesOf(row) }))
      .filter((row) => row.issues.length > 0)
      .slice(0, 8),
  }
}

export async function getContacts(): Promise<ContactRecord[]> {
  const rows = await db.contact.findMany({ orderBy: { createdAt: "desc" } })
  return rows.map(toContactRecord)
}

export async function getContact(id: string): Promise<ContactRecord | undefined> {
  const row = await db.contact.findUnique({ where: { id } })
  return row ? toContactRecord(row) : undefined
}

function toContactRecord(row: {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  createdAt: Date
  status: ContactRecord["status"]
}): ContactRecord {
  return { ...row, phone: row.phone ?? undefined, createdAt: row.createdAt.toISOString() }
}

export async function getAdminArticles(): Promise<AdminArticle[]> {
  const now = new Date()
  const rows = await db.article.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true,
      publishedAt: true,
      deletedAt: true,
      viewCount: true,
      category: { select: { slug: true, name: true } },
      ...seoFields,
    },
  })

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    status: row.status,
    updatedAt: row.updatedAt.toISOString(),
    publishedAt: row.publishedAt?.toISOString(),
    deletedAt: row.deletedAt?.toISOString(),
    views: row.viewCount,
    seoIssues: seoIssuesOf(row),
    publicUrl:
      row.status === "PUBLISHED" && !row.deletedAt && row.publishedAt && row.publishedAt <= now
        ? `/blog/${row.slug}`
        : undefined,
  }))
}

export async function getAdminCategories() {
  return db.category.findMany({ select: { slug: true, name: true }, orderBy: [{ position: "asc" }, { name: "asc" }] })
}

export async function getAdminTaxonomy(): Promise<{ categories: AdminCategory[]; tags: AdminTag[] }> {
  const [categories, tags] = await Promise.all([
    db.category.findMany({
      orderBy: [{ position: "asc" }, { name: "asc" }],
      select: { slug: true, name: true, icon: true, _count: { select: { articles: { where: { deletedAt: null } } } } },
    }),
    db.tag.findMany({ orderBy: { name: "asc" }, select: { slug: true, name: true, _count: { select: { articles: true } } } }),
  ])
  return {
    categories: categories.map(({ _count, ...category }) => ({ ...category, count: _count.articles })),
    tags: tags.map(({ _count, ...tag }) => ({ ...tag, count: _count.articles })),
  }
}

export async function getMediaLibrary(): Promise<MediaItem[]> {
  const rows = await db.media.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      alt: true,
      width: true,
      height: true,
      sizeBytes: true,
      createdAt: true,
      _count: { select: { coverOf: true, ogImageOf: true } },
    },
  })
  return rows.map((row) => ({
    id: row.id,
    filename: row.filename,
    alt: row.alt,
    width: row.width,
    height: row.height,
    sizeKb: Math.round(row.sizeBytes / 1024),
    createdAt: row.createdAt.toISOString(),
    usedIn: row._count.coverOf + row._count.ogImageOf,
  }))
}

export async function getSiteSettings(): Promise<SiteSettings | undefined> {
  const row = await db.setting.findUnique({ where: { id: 1 } })
  if (!row) return undefined
  return {
    name: row.siteName,
    tagline: row.tagline,
    description: row.description,
    phone: row.phone,
    email: row.email,
    city: row.city,
    hours: row.hours,
    instagram: row.instagramUrl,
    facebook: row.facebookUrl,
    linkedin: row.linkedinUrl,
    notificationEmail: row.notificationEmail,
  }
}
