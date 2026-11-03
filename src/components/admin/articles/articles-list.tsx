"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Pencil,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react"
import { cn } from "cn"

import { NotConnectedNotice } from "@/components/admin/auth-fields"
import { EmptyState, StatusBadge } from "@/components/admin/dashboard/widgets"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import type { AdminArticle } from "@/lib/admin/articles"
import { seoIssueLabels, type PostStatus } from "@/lib/admin/labels"
import { formatDayMonth } from "@/lib/admin/format"
import { frenchTypo } from "@/lib/format"

type Tab = "ALL" | PostStatus | "TRASH"
type Sort = "updated" | "published" | "title"

const tabs: { value: Tab; label: string }[] = [
  { value: "ALL", label: "Tous" },
  { value: "DRAFT", label: "Brouillons" },
  { value: "SCHEDULED", label: "Programmés" },
  { value: "PUBLISHED", label: "Publiés" },
  { value: "TRASH", label: "Corbeille" },
]

const PER_PAGE = 10

const normalize = (text: string) =>
  text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

const selectClass =
  "h-11 rounded-xl border border-plum/20 bg-[#faf3f1] px-3 text-sm text-plum outline-none focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/40"

const iconButton =
  "flex size-9 items-center justify-center rounded-lg text-plum/70 outline-none transition-colors hover:bg-blush hover:text-plum focus-visible:ring-3 focus-visible:ring-ring/50"

// Liste des articles : onglets par statut, recherche, catégorie, tri, pagination.
// Démo : tout se fait dans le navigateur. Les actions (dupliquer, corbeille…)
// ne sont pas encore enregistrées et le disent.
function ArticlesList({
  articles,
  categories,
  trashRetentionDays,
}: {
  articles: AdminArticle[]
  categories: { slug: string; name: string }[]
  trashRetentionDays: number
}) {
  const [tab, setTab] = useState<Tab>("ALL")
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [sort, setSort] = useState<Sort>("updated")
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState(false)

  const counts = useMemo(() => {
    const result: Record<Tab, number> = { ALL: 0, DRAFT: 0, SCHEDULED: 0, PUBLISHED: 0, TRASH: 0 }
    for (const article of articles) {
      if (article.deletedAt) result.TRASH++
      else {
        result.ALL++
        result[article.status]++
      }
    }
    return result
  }, [articles])

  const terms = normalize(query).split(/\s+/).filter(Boolean)
  const filtered = articles
    .filter((article) => (tab === "TRASH" ? article.deletedAt : !article.deletedAt))
    .filter((article) => tab === "ALL" || tab === "TRASH" || article.status === tab)
    .filter((article) => !category || article.category.slug === category)
    .filter((article) => terms.every((term) => normalize(article.title).includes(term)))
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title, "fr")
      if (sort === "published") return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
      return b.updatedAt.localeCompare(a.updatedAt)
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  // Toute modification des filtres revient à la page 1.
  const update = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  const action = () => setNotice(true)

  return (
    <div className="rounded-3xl border border-gold/25 bg-white p-4 shadow-sm shadow-plum/5 sm:p-6">
      <div role="group" aria-label="Filtrer par statut" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {tabs.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => update(setTab)(value)}
            aria-pressed={tab === value}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              tab === value ? "border-plum bg-plum text-blush" : "border-gold/40 text-plum hover:border-plum",
              value === "TRASH" && "sm:ml-auto"
            )}
          >
            {value === "TRASH" && <Trash2 aria-hidden="true" className="size-4" />}
            {label}
            <span className={cn("text-xs", tab === value ? "text-gold" : "text-plum/60")}>{counts[value]}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_14rem_14rem]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <label htmlFor="articles-search" className="sr-only">
            Rechercher un article
          </label>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-plum/60" />
          <input
            id="articles-search"
            type="search"
            value={query}
            onChange={(event) => update(setQuery)(event.target.value)}
            placeholder="Rechercher par titre…"
            className={cn(selectClass, "w-full pl-10")}
          />
        </div>
        <div>
          <label htmlFor="articles-category" className="sr-only">
            Catégorie
          </label>
          <select id="articles-category" value={category} onChange={(event) => update(setCategory)(event.target.value)} className={cn(selectClass, "w-full")}>
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="articles-sort" className="sr-only">
            Trier par
          </label>
          <select id="articles-sort" value={sort} onChange={(event) => update(setSort)(event.target.value as Sort)} className={cn(selectClass, "w-full")}>
            <option value="updated">Dernière modification</option>
            <option value="published">Date de publication</option>
            <option value="title">Titre (A → Z)</option>
          </select>
        </div>
      </div>

      {tab === "TRASH" && (
        <p className="mt-4 text-sm text-plum/75">
          Les articles de la corbeille sont supprimés définitivement au bout de {trashRetentionDays} jours.
        </p>
      )}

      <p role="status" className="sr-only">
        {filtered.length} article{filtered.length > 1 ? "s" : ""}
      </p>

      {notice && (
        <div className="mt-4">
          <NotConnectedNotice>
            Cette action n&apos;est pas encore enregistrée : elle le sera une fois l&apos;administration reliée à la base de données.
          </NotConnectedNotice>
        </div>
      )}

      <div className="mt-5">
        {visible.length === 0 ? (
          <EmptyState>
            {tab === "TRASH" ? "La corbeille est vide." : "Aucun article ne correspond à ces critères."}
          </EmptyState>
        ) : (
          <ul className="divide-y divide-plum/10">
            {visible.map((article) => (
              <li key={article.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 sm:flex-nowrap">
                <div className="hidden w-20 shrink-0 overflow-hidden rounded-xl sm:block">
                  <ImagePlaceholder label="" className="aspect-4/3 [&_span]:hidden [&_svg]:size-6" />
                </div>

                <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                  <p className="truncate font-medium text-plum">{frenchTypo(article.title)}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-plum/70">
                    <span>{article.category.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {article.deletedAt
                        ? `Supprimé le ${formatDayMonth(article.deletedAt)}`
                        : article.status === "PUBLISHED" && article.publishedAt
                          ? `Publié le ${formatDayMonth(article.publishedAt)}`
                          : article.status === "SCHEDULED" && article.publishedAt
                            ? `Prévu le ${formatDayMonth(article.publishedAt)}`
                            : `Modifié le ${formatDayMonth(article.updatedAt)}`}
                    </span>
                    {article.status === "PUBLISHED" && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Eye aria-hidden="true" className="size-3.5" />
                          {article.views}
                          <span className="sr-only"> lectures</span>
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {article.seoIssues.length === 0 ? (
                    <span title="SEO complet" className="text-plum/60">
                      <CheckCircle2 aria-hidden="true" className="size-5" />
                      <span className="sr-only">SEO complet</span>
                    </span>
                  ) : (
                    <span
                      title={article.seoIssues.map((issue) => seoIssueLabels[issue]).join(" · ")}
                      className="inline-flex items-center gap-1 text-xs font-medium text-plum"
                    >
                      <AlertTriangle aria-hidden="true" className="size-5 text-gold" />
                      <span className="sr-only">SEO incomplet : </span>
                      {article.seoIssues.length}
                    </span>
                  )}
                  <StatusBadge kind="post" status={article.status} />
                </div>

                <div className="ml-auto flex items-center gap-1">
                  {article.deletedAt ? (
                    <>
                      <button type="button" onClick={action} title="Restaurer" className={iconButton}>
                        <RotateCcw aria-hidden="true" className="size-4" />
                        <span className="sr-only">Restaurer « {article.title} »</span>
                      </button>
                      <button type="button" onClick={action} title="Supprimer définitivement" className={cn(iconButton, "text-destructive hover:text-destructive")}>
                        <Trash2 aria-hidden="true" className="size-4" />
                        <span className="sr-only">Supprimer définitivement « {article.title} »</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <span aria-disabled="true" title="Modifier (l'éditeur arrive bientôt)" className={cn(iconButton, "cursor-not-allowed opacity-40 hover:bg-transparent")}>
                        <Pencil aria-hidden="true" className="size-4" />
                        <span className="sr-only">Modifier « {article.title} » (bientôt disponible)</span>
                      </span>
                      {article.publicUrl ? (
                        <Link href={article.publicUrl} target="_blank" title="Voir sur le site" className={iconButton}>
                          <ExternalLink aria-hidden="true" className="size-4" />
                          <span className="sr-only">Voir « {article.title} » sur le site (nouvel onglet)</span>
                        </Link>
                      ) : (
                        <span aria-hidden="true" className="size-9" />
                      )}
                      <button type="button" onClick={action} title="Dupliquer" className={iconButton}>
                        <Copy aria-hidden="true" className="size-4" />
                        <span className="sr-only">Dupliquer « {article.title} »</span>
                      </button>
                      <button type="button" onClick={action} title="Mettre à la corbeille" className={iconButton}>
                        <Trash2 aria-hidden="true" className="size-4" />
                        <span className="sr-only">Mettre « {article.title} » à la corbeille</span>
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination des articles" className="mt-5 flex items-center justify-between gap-3 border-t border-plum/10 pt-4 text-sm">
          <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="inline-flex h-10 items-center gap-1 rounded-full border border-gold/40 px-3 text-plum disabled:opacity-40">
            <ChevronLeft aria-hidden="true" className="size-4" />
            Précédent
          </button>
          <p className="text-plum/75">
            Page {currentPage} sur {totalPages}
          </p>
          <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="inline-flex h-10 items-center gap-1 rounded-full border border-gold/40 px-3 text-plum disabled:opacity-40">
            Suivant
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        </nav>
      )}
    </div>
  )
}

export { ArticlesList }
