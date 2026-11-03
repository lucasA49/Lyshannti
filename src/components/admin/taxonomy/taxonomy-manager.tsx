"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2, X } from "lucide-react"
import { cn } from "cn"

import { NotConnectedNotice } from "@/components/admin/auth-fields"
import { CategoryIcon } from "@/components/blog/category-icon"
import type { AdminCategory, AdminTag } from "@/lib/admin/taxonomy"
import type { CategoryIcon as CategoryIconName } from "@/lib/blog-types"
import { slugify } from "@/lib/slug"

const fieldClass =
  "h-10 w-full rounded-xl border border-plum/20 bg-[#faf3f1] px-3 text-sm text-plum outline-none placeholder:text-plum/50 focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/40"

const iconButton =
  "flex size-9 items-center justify-center rounded-lg text-plum/70 outline-none transition-colors hover:bg-blush hover:text-plum focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"

function Panel({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="min-w-0 rounded-3xl border border-gold/25 bg-white p-5 shadow-sm shadow-plum/5 sm:p-6">
      <h2 id={id} className="flex items-center gap-3 font-heading text-xl font-semibold text-plum">
        <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-gold" />
        {title}
      </h2>
      <p className="mt-1 text-sm text-plum/70">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

// Formulaire de catégorie (création ou modification) : nom, adresse, icône.
function CategoryForm({
  icons,
  initial,
  onCancel,
  onSubmit,
}: {
  icons: { value: CategoryIconName; label: string }[]
  initial?: AdminCategory
  onCancel: () => void
  onSubmit: () => void
}) {
  const [name, setName] = useState(initial?.name ?? "")
  const [slug, setSlug] = useState(initial?.slug ?? "")
  const [slugEdited, setSlugEdited] = useState(Boolean(initial))
  const [icon, setIcon] = useState<CategoryIconName>(initial?.icon ?? "lotus")
  const prefix = initial ? `edit-${initial.slug}` : "new-category"

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (name.trim()) onSubmit()
      }}
      className="space-y-4 rounded-2xl border border-gold/40 bg-[#faf3f1] p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${prefix}-name`} className="mb-1 block text-sm font-medium text-plum">
            Nom
          </label>
          <input
            id={`${prefix}-name`}
            value={name}
            required
            onChange={(event) => {
              setName(event.target.value)
              if (!slugEdited) setSlug(slugify(event.target.value))
            }}
            placeholder="Ex. : Soins énergétiques"
            className={cn(fieldClass, "bg-white")}
          />
        </div>
        <div>
          <label htmlFor={`${prefix}-slug`} className="mb-1 block text-sm font-medium text-plum">
            Adresse
          </label>
          <div className="flex items-center rounded-xl border border-plum/20 bg-white focus-within:border-plum focus-within:ring-3 focus-within:ring-ring/40">
            <span className="pl-3 text-xs text-plum/55">/blog/categorie/</span>
            <input
              id={`${prefix}-slug`}
              value={slug}
              onChange={(event) => {
                setSlug(event.target.value)
                setSlugEdited(true)
              }}
              className="h-10 min-w-0 flex-1 bg-transparent pr-3 text-sm text-plum outline-none"
            />
          </div>
        </div>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-plum">Icône</legend>
        <div className="flex flex-wrap gap-2">
          {icons.map((choice) => (
            <label
              key={choice.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                icon === choice.value ? "border-plum bg-plum text-blush [&_svg]:text-gold" : "border-gold/40 bg-white text-plum hover:border-plum"
              )}
            >
              <input
                type="radio"
                name={`${prefix}-icon`}
                value={choice.value}
                checked={icon === choice.value}
                onChange={() => setIcon(choice.value)}
                className="sr-only"
              />
              <CategoryIcon name={choice.value} className="size-4" />
              {choice.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="h-10 rounded-full bg-gold px-5 text-sm font-semibold text-plum outline-none hover:bg-gold/85 focus-visible:ring-3 focus-visible:ring-ring/50">
          {initial ? "Enregistrer" : "Créer la catégorie"}
        </button>
        <button type="button" onClick={onCancel} className="h-10 rounded-full px-4 text-sm font-medium text-plum outline-none hover:bg-white focus-visible:ring-3 focus-visible:ring-ring/50">
          Annuler
        </button>
      </div>
    </form>
  )
}

function TaxonomyManager({
  categories,
  tags,
  icons,
}: {
  categories: AdminCategory[]
  tags: AdminTag[]
  icons: { value: CategoryIconName; label: string }[]
}) {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [newTag, setNewTag] = useState("")
  const [notice, setNotice] = useState(false)

  const done = () => {
    setCreating(false)
    setEditing(null)
    setNotice(true)
  }

  return (
    <div className="space-y-6">
      {notice && (
        <NotConnectedNotice>
          Les modifications ne sont pas encore enregistrées : elles le seront une fois l&apos;administration reliée à la base de données.
        </NotConnectedNotice>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:items-start">
        <Panel
          id="categories-title"
          title="Catégories"
          description="Chaque article appartient à une catégorie. Elles apparaissent en filtres sur la page Blog."
        >
          {creating ? (
            <CategoryForm icons={icons} onCancel={() => setCreating(false)} onSubmit={done} />
          ) : (
            <button
              type="button"
              onClick={() => {
                setCreating(true)
                setEditing(null)
              }}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-dashed border-gold px-4 text-sm font-medium text-plum outline-none hover:bg-blush/40 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Plus aria-hidden="true" className="size-4" />
              Nouvelle catégorie
            </button>
          )}

          <ul className="mt-4 divide-y divide-plum/10">
            {categories.map((category) => (
              <li key={category.slug} className="py-3">
                {editing === category.slug ? (
                  <CategoryForm icons={icons} initial={category} onCancel={() => setEditing(null)} onSubmit={done} />
                ) : (
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blush text-plum">
                      <CategoryIcon name={category.icon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-plum">{category.name}</p>
                      <p className="truncate text-xs text-plum/60">
                        <span className="sm:hidden">
                          {category.count} article{category.count > 1 ? "s" : ""}
                        </span>
                        <span className="hidden sm:inline">/blog/categorie/{category.slug}</span>
                      </p>
                    </div>
                    <span className="hidden shrink-0 text-sm text-plum/70 sm:inline">
                      {category.count} article{category.count > 1 ? "s" : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(category.slug)
                        setCreating(false)
                      }}
                      className={iconButton}
                      title="Modifier"
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                      <span className="sr-only">Modifier la catégorie {category.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={done}
                      disabled={category.count > 0}
                      className={iconButton}
                      title={category.count > 0 ? "Déplacez d'abord ses articles dans une autre catégorie" : "Supprimer"}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                      <span className="sr-only">
                        Supprimer la catégorie {category.name}
                        {category.count > 0 && " (impossible : elle contient des articles)"}
                      </span>
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          id="tags-title"
          title="Tags"
          description="Des mots-clés libres affichés en bas des articles. Inutile d'en créer beaucoup."
        >
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (newTag.trim()) {
                setNewTag("")
                done()
              }
            }}
            className="flex gap-2"
          >
            <label htmlFor="new-tag" className="sr-only">
              Nouveau tag
            </label>
            <input
              id="new-tag"
              value={newTag}
              onChange={(event) => setNewTag(event.target.value)}
              placeholder="Nouveau tag…"
              className={fieldClass}
            />
            <button type="submit" className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 text-sm font-semibold text-plum outline-none hover:bg-gold/85 focus-visible:ring-3 focus-visible:ring-ring/50">
              <Plus aria-hidden="true" className="size-4" />
              Ajouter
            </button>
          </form>

          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag.slug}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border py-1 pr-1 pl-3 text-sm",
                  tag.count === 0 ? "border-dashed border-plum/25 text-plum/65" : "border-gold/40 text-plum"
                )}
              >
                {tag.name}
                <span className="text-xs text-plum/55">{tag.count}</span>
                <button
                  type="button"
                  onClick={done}
                  title="Supprimer"
                  className="flex size-6 items-center justify-center rounded-full text-plum/60 outline-none hover:bg-blush hover:text-plum focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <X aria-hidden="true" className="size-3.5" />
                  <span className="sr-only">Supprimer le tag {tag.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-plum/60">Le chiffre indique le nombre d&apos;articles qui utilisent le tag.</p>
        </Panel>
      </div>
    </div>
  )
}

export { TaxonomyManager }
