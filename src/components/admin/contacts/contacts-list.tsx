"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"
import { cn } from "cn"

import { EmptyState, StatusBadge } from "@/components/admin/dashboard/widgets"
import { contactStatusLabels, type ContactStatus } from "@/lib/admin/labels"
import type { ContactRecord } from "@/lib/admin/contacts"
import { formatDayMonthTime } from "@/lib/admin/format"

type Filter = "ALL" | ContactStatus

const normalize = (text: string) =>
  text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

// Liste des demandes avec recherche et filtre par statut.
// Démo : filtrage dans le navigateur. Avec la base : filtres dans l'URL
// (?q=&statut=) et requête Prisma paginée côté serveur.
function ContactsList({ contacts }: { contacts: ContactRecord[] }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("ALL")

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { ALL: contacts.length, NEW: 0, IN_PROGRESS: 0, DONE: 0 }
    for (const contact of contacts) result[contact.status]++
    return result
  }, [contacts])

  const visible = contacts.filter((contact) => {
    if (filter !== "ALL" && contact.status !== filter) return false
    const terms = normalize(query).split(/\s+/).filter(Boolean)
    const haystack = normalize(`${contact.name} ${contact.email} ${contact.subject} ${contact.message}`)
    return terms.every((term) => haystack.includes(term))
  })

  const filters: Filter[] = ["ALL", "NEW", "IN_PROGRESS", "DONE"]

  return (
    <div className="rounded-3xl border border-gold/25 bg-white p-4 shadow-sm shadow-plum/5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filtrer par statut" className="flex flex-wrap gap-2">
          {filters.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                filter === value ? "border-plum bg-plum text-blush" : "border-gold/40 text-plum hover:border-plum"
              )}
            >
              {value === "ALL" ? "Toutes" : contactStatusLabels[value]}
              <span className={cn("text-xs", filter === value ? "text-gold" : "text-plum/60")}>{counts[value]}</span>
            </button>
          ))}
        </div>

        <div className="relative lg:w-80">
          <label htmlFor="contacts-search" className="sr-only">
            Rechercher une demande
          </label>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-plum/60" />
          <input
            id="contacts-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nom, e-mail, sujet, message…"
            className="h-11 w-full rounded-xl border border-plum/20 bg-[#faf3f1] pr-3 pl-10 text-sm text-plum outline-none placeholder:text-plum/55 focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </div>
      </div>

      <p role="status" className="sr-only">
        {visible.length} demande{visible.length > 1 ? "s" : ""} affichée{visible.length > 1 ? "s" : ""}
      </p>

      <div className="mt-5">
        {visible.length === 0 ? (
          <EmptyState>Aucune demande ne correspond à votre recherche.</EmptyState>
        ) : (
          <ul className="divide-y divide-plum/10">
            {visible.map((contact) => (
              <li key={contact.id}>
                <Link
                  href={`/admin/contacts/${contact.id}`}
                  className="group -mx-2 flex items-center gap-3 rounded-2xl px-2 py-3 outline-none hover:bg-[#faf3f1] focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-4"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full font-heading",
                      contact.status === "NEW" ? "bg-gold text-plum" : "bg-blush text-plum"
                    )}
                  >
                    {contact.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2">
                      <span className={cn("truncate text-plum", contact.status === "NEW" ? "font-semibold" : "font-medium")}>
                        {contact.name}
                      </span>
                      <span className="hidden truncate text-sm text-plum/60 sm:inline">{contact.email}</span>
                    </p>
                    <p className="truncate text-sm text-plum/75">
                      <span className="font-medium text-plum">{contact.subject}</span> — {contact.message}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge kind="contact" status={contact.status} />
                    <time dateTime={contact.createdAt} className="text-xs text-plum/65">
                      {formatDayMonthTime(contact.createdAt)}
                    </time>
                  </div>
                  <ChevronRight aria-hidden="true" className="hidden size-5 shrink-0 text-plum/40 group-hover:text-plum sm:block" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export { ContactsList }
