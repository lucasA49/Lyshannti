import Link from "next/link"
import { AlertTriangle, CalendarClock, Eye, FilePen, FileText, Mail, PenLine } from "lucide-react"
import { cn } from "cn"

import { EmptyState, Panel, StatusBadge } from "@/components/admin/dashboard/widgets"
import { seoIssueLabels, type DashboardData } from "@/lib/admin/dashboard"
import { formatDayMonth, formatDayMonthTime, formatWeekday, parisDayKey } from "@/lib/admin/format"
import { frenchTypo } from "@/lib/format"

// Blocs du tableau de bord. Les liens vers les pages pas encore construites
// (articles, contacts) sont affichés « bientôt » pour éviter des 404.

export function StatCards({ stats }: { stats: DashboardData["stats"] }) {
  const cards = [
    {
      label: "Nouvelles demandes",
      value: stats.newContacts,
      hint: stats.newContacts > 0 ? "à traiter" : "tout est traité",
      icon: Mail,
      highlight: stats.newContacts > 0,
    },
    {
      label: "Articles publiés",
      value: stats.publishedPosts,
      hint: `dont ${stats.publishedThisMonth} ce mois-ci`,
      icon: FileText,
    },
    { label: "Brouillons", value: stats.drafts, hint: "en cours d'écriture", icon: FilePen },
    {
      label: "Articles programmés",
      value: stats.scheduled,
      hint: stats.nextScheduled ? `prochain le ${formatDayMonth(stats.nextScheduled.publishedAt)}` : "aucun prévu",
      icon: CalendarClock,
    },
  ]

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {cards.map(({ label, value, hint, icon: Icon, highlight }) => (
        <li
          key={label}
          className={cn(
            "flex flex-col items-start gap-3 rounded-3xl border p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:p-5",
            highlight ? "on-dark border-plum bg-plum text-blush shadow-plum/20" : "border-gold/25 bg-white shadow-plum/5"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl",
              highlight ? "bg-gold text-plum" : "bg-blush text-plum"
            )}
          >
            <Icon className="size-6" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className={cn("text-sm", highlight ? "text-blush/85" : "text-plum/75")}>{label}</p>
            <p className="font-heading text-3xl leading-tight font-semibold">{value}</p>
            <p className={cn("text-xs", highlight ? "text-gold" : "text-plum/65")}>{hint}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function RecentContacts({ contacts }: { contacts: DashboardData["recentContacts"] }) {
  return (
    <Panel
      id="recent-contacts"
      title="À traiter"
      action={
        <Link href="/admin/contacts" className="rounded-sm text-sm font-medium text-plum underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
          Voir toutes les demandes
        </Link>
      }
    >
      {contacts.length === 0 ? (
        <EmptyState>Aucune demande de contact pour le moment.</EmptyState>
      ) : (
        <ul className="divide-y divide-plum/10">
          {contacts.map((contact) => (
            <li key={contact.id} className="py-1.5 first:pt-0 last:pb-0">
              <Link
                href={`/admin/contacts/${contact.id}`}
                className="-mx-2 flex items-center gap-3 rounded-2xl px-2 py-1.5 outline-none hover:bg-[#faf3f1] focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blush font-heading text-plum">
                  {contact.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-plum">{contact.name}</p>
                  <p className="truncate text-sm text-plum/70">{contact.subject}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge kind="contact" status={contact.status} />
                  <time dateTime={contact.createdAt} className="text-xs text-plum/65">
                    {formatDayMonthTime(contact.createdAt)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

export function RecentPosts({ posts }: { posts: DashboardData["recentPosts"] }) {
  return (
    <Panel
      id="recent-posts"
      title="Mes articles"
      action={
        <span aria-disabled="true" title="Bientôt disponible" className="inline-flex cursor-not-allowed items-center gap-1.5 text-sm font-medium text-plum/50">
          <PenLine aria-hidden="true" className="size-4" />
          Écrire un article
        </span>
      }
    >
      {posts.length === 0 ? (
        <EmptyState>Aucun article pour le moment : lancez-vous&nbsp;!</EmptyState>
      ) : (
        <ul className="divide-y divide-plum/10">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-plum">{frenchTypo(post.title)}</p>
                <p className="text-xs text-plum/65">
                  Modifié le <time dateTime={post.updatedAt}>{formatDayMonthTime(post.updatedAt)}</time>
                </p>
              </div>
              <StatusBadge kind="post" status={post.status} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

// 14 prochains jours, avec les articles programmés de chaque jour.
export function PublicationCalendar({ upcoming }: { upcoming: DashboardData["upcoming"] }) {
  const today = new Date()
  const days = Array.from({ length: 14 }, (_, i) => new Date(today.getTime() + i * 24 * 60 * 60 * 1000))
  const byDay = new Map<string, DashboardData["upcoming"]>()
  for (const post of upcoming) {
    const key = parisDayKey(new Date(post.publishedAt))
    byDay.set(key, [...(byDay.get(key) ?? []), post])
  }

  return (
    <Panel id="calendar" title="Calendrier de publication" className="xl:col-span-2">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((date, index) => {
          const posts = byDay.get(parisDayKey(date)) ?? []
          return (
            <li
              key={index}
              className={cn(
                "min-h-24 rounded-2xl border p-2.5",
                posts.length > 0 ? "border-gold bg-gold/15" : "border-plum/10 bg-[#faf3f1]",
                index === 0 && "ring-2 ring-plum/30"
              )}
            >
              <p className="text-xs text-plum/70 capitalize">
                {index === 0 ? "Aujourd'hui" : formatWeekday(date)}
              </p>
              <p className="font-heading text-lg font-semibold text-plum">{formatDayMonth(date.toISOString())}</p>
              {posts.map((post) => (
                <p key={post.id} className="mt-1 line-clamp-2 text-xs font-medium text-plum">
                  {frenchTypo(post.title)}
                </p>
              ))}
            </li>
          )
        })}
      </ol>
      {upcoming.length === 0 && (
        <p className="mt-3 text-sm text-plum/75">Aucun article programmé sur les deux prochaines semaines.</p>
      )}
    </Panel>
  )
}

export function TopPosts({ posts }: { posts: DashboardData["topPosts"] }) {
  const max = Math.max(1, ...posts.map((post) => post.views))

  return (
    <Panel id="top-posts" title="Les plus lus">
      {posts.length === 0 ? (
        <EmptyState>Les statistiques apparaîtront après les premières lectures.</EmptyState>
      ) : (
        <ol className="space-y-3">
          {posts.map((post, index) => (
            <li key={post.id}>
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-lg font-semibold text-plum/60">{index + 1}</span>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-plum">{frenchTypo(post.title)}</p>
                <span className="inline-flex items-center gap-1 text-xs text-plum/70">
                  <Eye aria-hidden="true" className="size-3.5" />
                  {post.views}
                  <span className="sr-only"> lectures</span>
                </span>
              </div>
              <div aria-hidden="true" className="mt-1 ml-7 h-1.5 overflow-hidden rounded-full bg-blush">
                <div className="h-full rounded-full bg-plum" style={{ width: `${(post.views / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}

export function SeoIssues({ items }: { items: DashboardData["seoIssues"] }) {
  return (
    <Panel id="seo-issues" title="Points d'attention SEO">
      {items.length === 0 ? (
        <EmptyState>Tous les articles sont complets. Bravo&nbsp;!</EmptyState>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 rounded-2xl bg-[#faf3f1] p-3">
              <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-plum/70" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-plum">{frenchTypo(item.title)}</p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {item.issues.map((issue) => (
                    <li key={issue} className="rounded-full border border-gold/50 px-2 py-0.5 text-xs text-plum">
                      {seoIssueLabels[issue]}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
