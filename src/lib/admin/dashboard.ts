// Données du tableau de bord de l'admin : SEUL point de lecture.
// Aujourd'hui : démonstration (`admin.placeholder.ts`). Demain : requêtes Prisma,
// lancées en parallèle et uniquement après vérification de la session admin.

import { demoAdmin, demoContacts, demoPosts as allDemoPosts } from "@/content/admin.placeholder"

import type { ContactStatus, PostStatus, SeoIssue } from "@/lib/admin/labels"

export type { ContactStatus, PostStatus, SeoIssue } from "@/lib/admin/labels"
export { contactStatusLabels, postStatusLabels, seoIssueLabels } from "@/lib/admin/labels"

export type DashboardData = {
  isDemo: boolean
  admin: { name: string; email: string }
  stats: {
    newContacts: number
    publishedPosts: number
    publishedThisMonth: number
    drafts: number
    scheduled: number
    nextScheduled?: { title: string; publishedAt: string }
  }
  recentContacts: { id: string; name: string; subject: string; createdAt: string; status: ContactStatus }[]
  recentPosts: { id: string; title: string; status: PostStatus; updatedAt: string }[]
  /** Articles programmés dans les 14 prochains jours. */
  upcoming: { id: string; title: string; publishedAt: string }[]
  topPosts: { id: string; title: string; views: number }[]
  seoIssues: { id: string; title: string; issues: SeoIssue[] }[]
}

// Base de données si disponible (sinon démo : site statique GitHub Pages).
const fromDatabase = () => (process.env.DATABASE_URL ? import("@/lib/admin/admin-db") : null)

export async function getDashboardData(): Promise<DashboardData> {
  const database = await fromDatabase()
  if (database) return database.getDashboardData()

  // Les articles à la corbeille ne comptent pas.
  const demoPosts = allDemoPosts.filter((post) => !post.deletedAt)
  const now = Date.now()
  const inTwoWeeks = now + 14 * 24 * 60 * 60 * 1000
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)

  const published = demoPosts.filter((post) => post.status === "PUBLISHED")
  const scheduled = demoPosts
    .filter((post) => post.status === "SCHEDULED" && post.publishedAt)
    .sort((a, b) => a.publishedAt!.localeCompare(b.publishedAt!))

  return {
    isDemo: true,
    admin: demoAdmin,
    stats: {
      newContacts: demoContacts.filter((contact) => contact.status === "NEW").length,
      publishedPosts: published.length,
      publishedThisMonth: published.filter((post) => new Date(post.publishedAt!) >= monthStart).length,
      drafts: demoPosts.filter((post) => post.status === "DRAFT").length,
      scheduled: scheduled.length,
      nextScheduled: scheduled[0] && { title: scheduled[0].title, publishedAt: scheduled[0].publishedAt! },
    },
    recentContacts: [...demoContacts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    recentPosts: [...demoPosts]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5)
      .map(({ id, title, status, updatedAt }) => ({ id, title, status, updatedAt })),
    upcoming: scheduled
      .filter((post) => new Date(post.publishedAt!).getTime() <= inTwoWeeks)
      .map(({ id, title, publishedAt }) => ({ id, title, publishedAt: publishedAt! })),
    topPosts: [...published]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(({ id, title, views }) => ({ id, title, views })),
    seoIssues: demoPosts
      .filter((post) => post.seoIssues.length > 0)
      .map(({ id, title, seoIssues }) => ({ id, title, issues: seoIssues })),
  }
}
