"use client"

import { Check, Circle } from "lucide-react"
import { cn } from "cn"

import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import {
  META_DESCRIPTION_MAX,
  META_TITLE_MAX,
  type SeoCheck,
} from "@/lib/admin/seo-checklist"
import { siteConfig } from "@/config/site"

// Colonne de droite de l'éditeur : publication, organisation, image principale, SEO.

export type PublishMode = "draft" | "now" | "schedule"

export type ArticleMeta = {
  publishMode: PublishMode
  scheduledAt: string
  category: string
  tags: string
  coverId: string | null
  coverUrl: string | null
  coverAlt: string
  slug: string
  slugEdited: boolean
  metaTitle: string
  metaDescription: string
  focusKeyword: string
}

const fieldClass =
  "h-10 w-full rounded-xl border border-plum/20 bg-[#faf3f1] px-3 text-sm text-plum outline-none placeholder:text-plum/50 focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/40"

const labelClass = "mb-1 block text-sm font-medium text-plum"

export function SidePanel({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-3xl border border-gold/25 bg-white p-5 shadow-sm shadow-plum/5">
      <h2 id={id} className="flex items-center gap-2 font-heading text-lg font-semibold text-plum">
        <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-gold" />
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

function Counter({ value, max, min }: { value: number; max: number; min?: number }) {
  const ok = value > 0 && value <= max && (min === undefined || value >= min)
  return (
    <span className={cn("text-xs", ok ? "text-plum/60" : "font-medium text-plum")}>
      {value}/{max}
    </span>
  )
}

export function PublishPanel({
  meta,
  onChange,
}: {
  meta: ArticleMeta
  onChange: (patch: Partial<ArticleMeta>) => void
}) {
  const options: { value: PublishMode; label: string }[] = [
    { value: "draft", label: "Brouillon (non visible)" },
    { value: "now", label: "Publier maintenant" },
    { value: "schedule", label: "Programmer" },
  ]

  return (
    <SidePanel id="panel-publish" title="Publication">
      <fieldset className="space-y-2">
        <legend className="sr-only">Mode de publication</legend>
        {options.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm text-plum">
            <input
              type="radio"
              name="publish-mode"
              value={option.value}
              checked={meta.publishMode === option.value}
              onChange={() => onChange({ publishMode: option.value })}
              className="size-4 accent-plum"
            />
            {option.label}
          </label>
        ))}
      </fieldset>
      {meta.publishMode === "schedule" && (
        <div>
          <label htmlFor="scheduled-at" className={labelClass}>
            Date et heure de publication
          </label>
          <input
            id="scheduled-at"
            type="datetime-local"
            value={meta.scheduledAt}
            onChange={(event) => onChange({ scheduledAt: event.target.value })}
            className={fieldClass}
          />
        </div>
      )}
    </SidePanel>
  )
}

export function OrganisationPanel({
  meta,
  categories,
  onChange,
  onPickCover,
}: {
  meta: ArticleMeta
  categories: { slug: string; name: string }[]
  onChange: (patch: Partial<ArticleMeta>) => void
  onPickCover: () => void
}) {
  return (
    <SidePanel id="panel-organisation" title="Organisation">
      <div>
        <label htmlFor="article-category" className={labelClass}>
          Catégorie
        </label>
        <select
          id="article-category"
          value={meta.category}
          onChange={(event) => onChange({ category: event.target.value })}
          className={fieldClass}
        >
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="article-tags" className={labelClass}>
          Tags
        </label>
        <input
          id="article-tags"
          value={meta.tags}
          onChange={(event) => onChange({ tags: event.target.value })}
          placeholder="ancrage, intuition, routine"
          aria-describedby="article-tags-hint"
          className={fieldClass}
        />
        <p id="article-tags-hint" className="mt-1 text-xs text-plum/60">
          Séparés par des virgules.
        </p>
      </div>
      <div>
        <p className={labelClass}>Image principale</p>
        <div className="overflow-hidden rounded-2xl">
          {meta.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={meta.coverUrl} alt={meta.coverAlt} className="aspect-16/9 w-full object-cover" />
          ) : (
            <ImagePlaceholder label="Aucune image principale" className="aspect-16/9" />
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onPickCover}
            className="h-9 rounded-full border border-plum/25 px-3 text-sm font-medium text-plum outline-none hover:border-plum focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {meta.coverUrl ? "Changer l'image" : "Choisir une image"}
          </button>
          {meta.coverUrl && (
            <button
              type="button"
              onClick={() => onChange({ coverId: null, coverUrl: null, coverAlt: "" })}
              className="h-9 rounded-full px-3 text-sm text-plum/75 outline-none hover:bg-blush focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Retirer
            </button>
          )}
        </div>
        <label htmlFor="cover-alt" className={cn(labelClass, "mt-3")}>
          Texte alternatif (ALT)
        </label>
        <input
          id="cover-alt"
          value={meta.coverAlt}
          onChange={(event) => onChange({ coverAlt: event.target.value })}
          placeholder="Ex. : Bougie et pierres sur une table de soin"
          className={fieldClass}
        />
      </div>
    </SidePanel>
  )
}

export function SeoPanel({
  meta,
  title,
  excerpt,
  checks,
  onChange,
}: {
  meta: ArticleMeta
  title: string
  excerpt: string
  checks: SeoCheck[]
  onChange: (patch: Partial<ArticleMeta>) => void
}) {
  const displayTitle = meta.metaTitle || title || "Titre de l'article"
  const displayDescription = meta.metaDescription || excerpt || "Description de l'article…"
  const domain = siteConfig.url.replace(/^https?:\/\//, "")
  const done = checks.filter((check) => check.ok).length

  return (
    <SidePanel id="panel-seo" title="Référencement (SEO)">
      <div>
        <label htmlFor="article-slug" className={labelClass}>
          Adresse de la page
        </label>
        <div className="flex items-center rounded-xl border border-plum/20 bg-[#faf3f1] focus-within:border-plum focus-within:ring-3 focus-within:ring-ring/40">
          <span className="pl-3 text-xs text-plum/55">/blog/</span>
          <input
            id="article-slug"
            value={meta.slug}
            onChange={(event) => onChange({ slug: event.target.value, slugEdited: true })}
            className="h-10 min-w-0 flex-1 bg-transparent pr-3 text-sm text-plum outline-none"
          />
        </div>
      </div>
      <div>
        <label htmlFor="focus-keyword" className={labelClass}>
          Mot-clé principal
        </label>
        <input
          id="focus-keyword"
          value={meta.focusKeyword}
          onChange={(event) => onChange({ focusKeyword: event.target.value })}
          placeholder="Ex. : soin énergétique"
          className={fieldClass}
        />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="meta-title" className={labelClass}>
            Titre SEO
          </label>
          <Counter value={displayTitle === "Titre de l'article" ? 0 : displayTitle.length} max={META_TITLE_MAX} />
        </div>
        <input
          id="meta-title"
          value={meta.metaTitle}
          onChange={(event) => onChange({ metaTitle: event.target.value })}
          placeholder="Par défaut : le titre de l'article"
          className={fieldClass}
        />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="meta-description" className={labelClass}>
            Meta description
          </label>
          <Counter value={(meta.metaDescription || excerpt).length} max={META_DESCRIPTION_MAX} min={120} />
        </div>
        <textarea
          id="meta-description"
          value={meta.metaDescription}
          onChange={(event) => onChange({ metaDescription: event.target.value })}
          placeholder="Par défaut : le chapô"
          rows={3}
          className={cn(fieldClass, "h-auto py-2")}
        />
      </div>

      <div>
        <p className={labelClass}>Aperçu dans Google</p>
        <div className="rounded-2xl border border-plum/10 bg-white p-3 font-sans">
          <p className="truncate text-xs text-[#4d5156]">
            {domain} › blog › {meta.slug || "adresse"}
          </p>
          <p className="mt-0.5 line-clamp-1 text-lg leading-snug text-[#1a0dab]">{displayTitle}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-[#4d5156]">{displayDescription}</p>
        </div>
      </div>

      <div>
        <p className={cn(labelClass, "flex items-center justify-between")}>
          Vérifications
          <span className="text-xs font-normal text-plum/60">
            {done}/{checks.length}
          </span>
        </p>
        <ul className="space-y-1.5 text-sm">
          {checks.map((check) => (
            <li key={check.id} className={cn("flex items-start gap-2", check.ok ? "text-plum" : "text-plum/65")}>
              {check.ok ? (
                <Check aria-hidden="true" strokeWidth={3} className="mt-0.5 size-4 shrink-0 text-plum" />
              ) : (
                <Circle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              )}
              {check.label}
              <span className="sr-only">{check.ok ? " : validé" : " : à faire"}</span>
            </li>
          ))}
        </ul>
      </div>
    </SidePanel>
  )
}
