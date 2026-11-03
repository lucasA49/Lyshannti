"use client"

import { useEffect, useRef, useState } from "react"
import { AlertTriangle, Check, Copy, ImagePlus, Search, Trash2, Upload, X } from "lucide-react"
import { cn } from "cn"

import { NotConnectedNotice } from "@/components/admin/auth-fields"
import { EmptyState } from "@/components/admin/dashboard/widgets"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import type { MediaItem } from "@/lib/admin/media"
import { formatDayMonth } from "@/lib/admin/format"

type Pending = { id: string; name: string; sizeKb: number; url: string; error?: string }

const fieldClass =
  "h-10 w-full rounded-xl border border-plum/20 bg-[#faf3f1] px-3 text-sm text-plum outline-none placeholder:text-plum/50 focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/40"

// Bibliothèque d'images : ajout par glisser-déposer ou sélection, recherche,
// filtre « sans ALT », fiche de l'image. Les fichiers choisis sont vérifiés et
// prévisualisés dans le navigateur, mais pas envoyés (stockage à venir).
function MediaLibrary({
  items,
  acceptedTypes,
  maxSizeMb,
}: {
  items: MediaItem[]
  acceptedTypes: string[]
  maxSizeMb: number
}) {
  const [query, setQuery] = useState("")
  const [missingAltOnly, setMissingAltOnly] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pending, setPending] = useState<Pending[]>([])
  const [dragging, setDragging] = useState(false)
  const [notice, setNotice] = useState(false)
  const [copied, setCopied] = useState(false)

  // Aperçus locaux (blob:) : libérés quand on retire une image et en quittant la page.
  const previewUrls = useRef(new Set<string>())
  useEffect(() => {
    const urls = previewUrls.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  const removePending = (file: Pending) => {
    if (file.url) {
      URL.revokeObjectURL(file.url)
      previewUrls.current.delete(file.url)
    }
    setPending((current) => current.filter((item) => item.id !== file.id))
  }

  const createPreview = (file: File) => {
    const url = URL.createObjectURL(file)
    previewUrls.current.add(url)
    return url
  }

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const added = [...files].map((file) => {
      const error = !acceptedTypes.includes(file.type)
        ? "Format refusé (JPG, PNG, WebP ou AVIF uniquement)"
        : file.size > maxSizeMb * 1024 * 1024
          ? `Fichier trop lourd (${maxSizeMb} Mo maximum)`
          : undefined
      return {
        id: crypto.randomUUID(),
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        url: error ? "" : createPreview(file),
        error,
      }
    })
    setPending((current) => [...added, ...current])
  }

  const normalized = query.toLowerCase().trim()
  const visible = items.filter(
    (item) =>
      (!missingAltOnly || !item.alt) &&
      (!normalized || `${item.filename} ${item.alt}`.toLowerCase().includes(normalized))
  )
  const missingAltCount = items.filter((item) => !item.alt).length
  const selected = items.find((item) => item.id === selectedId)

  return (
    <div className="space-y-6">
      {/* Zone d'ajout */}
      <label
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          addFiles(event.dataTransfer.files)
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-colors focus-within:ring-3 focus-within:ring-ring/50",
          dragging ? "border-plum bg-blush/60" : "border-gold/60 bg-white hover:bg-blush/30"
        )}
      >
        <Upload aria-hidden="true" className="size-8 text-plum/70" />
        <span className="font-medium text-plum">Glissez vos images ici ou cliquez pour les choisir</span>
        <span className="text-sm text-plum/65">JPG, PNG, WebP ou AVIF · {maxSizeMb} Mo maximum par image</span>
        <input
          type="file"
          accept={acceptedTypes.join(",")}
          multiple
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files)
            event.target.value = ""
          }}
        />
      </label>

      {pending.length > 0 && (
        <section aria-labelledby="pending-title" className="rounded-3xl border border-gold/25 bg-white p-5 shadow-sm shadow-plum/5">
          <h2 id="pending-title" className="font-heading text-lg font-semibold text-plum">
            Images sélectionnées
          </h2>
          <div className="mt-3">
            <NotConnectedNotice>
              Ces images ne sont pas encore envoyées : le stockage sera branché avec le backend.
            </NotConnectedNotice>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {pending.map((file) => (
              <li key={file.id} className="relative overflow-hidden rounded-2xl border border-plum/10 bg-[#faf3f1]">
                {file.error ? (
                  <div className="flex aspect-square flex-col items-center justify-center gap-1 p-2 text-center text-xs text-destructive">
                    <AlertTriangle aria-hidden="true" className="size-5" />
                    {file.error}
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.url} alt="" className="aspect-square w-full object-cover" />
                )}
                <p className="truncate px-2 py-1.5 text-xs text-plum">{file.name}</p>
                <button
                  type="button"
                  onClick={() => removePending(file)}
                  aria-label={`Retirer ${file.name}`}
                  className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-white/90 text-plum shadow-sm outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section aria-label="Bibliothèque" className="min-w-0 rounded-3xl border border-gold/25 bg-white p-4 shadow-sm shadow-plum/5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <label htmlFor="media-search" className="sr-only">
                Rechercher une image
              </label>
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-plum/60" />
              <input
                id="media-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nom du fichier ou description…"
                className={cn(fieldClass, "pl-10")}
              />
            </div>
            <button
              type="button"
              onClick={() => setMissingAltOnly((value) => !value)}
              aria-pressed={missingAltOnly}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                missingAltOnly ? "border-plum bg-plum text-blush" : "border-gold/40 text-plum hover:border-plum"
              )}
            >
              <AlertTriangle aria-hidden="true" className="size-4" />
              Sans ALT
              <span className={cn("text-xs", missingAltOnly ? "text-gold" : "text-plum/60")}>{missingAltCount}</span>
            </button>
          </div>

          <div className="mt-5">
            {visible.length === 0 ? (
              <EmptyState>Aucune image ne correspond.</EmptyState>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {visible.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(item.id)
                        setCopied(false)
                      }}
                      aria-pressed={item.id === selectedId}
                      className={cn(
                        "group w-full overflow-hidden rounded-2xl border-2 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        item.id === selectedId ? "border-plum" : "border-transparent hover:border-gold/60"
                      )}
                    >
                      <div className="relative">
                        <ImagePlaceholder label="" className="aspect-square [&_span]:hidden" />
                        {!item.alt && (
                          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-semibold text-plum">
                            <AlertTriangle aria-hidden="true" className="size-3" />
                            Sans ALT
                          </span>
                        )}
                      </div>
                      <p className="truncate bg-[#faf3f1] px-2 py-1.5 text-xs text-plum">{item.filename}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <aside aria-label="Détails de l'image" className="rounded-3xl border border-gold/25 bg-white p-5 shadow-sm shadow-plum/5 lg:sticky lg:top-24">
          {selected ? (
            <div className="space-y-4">
              <ImagePlaceholder label={selected.alt || selected.filename} className="aspect-4/3 rounded-2xl" />
              <div>
                <p className="font-medium break-all text-plum">{selected.filename}</p>
                <p className="mt-1 text-xs text-plum/65">
                  {selected.width} × {selected.height} px · {selected.sizeKb} Ko · ajoutée le {formatDayMonth(selected.createdAt)}
                </p>
                <p className="mt-1 text-xs text-plum/65">
                  {selected.usedIn > 0
                    ? `Utilisée dans ${selected.usedIn} article${selected.usedIn > 1 ? "s" : ""}`
                    : "Utilisée dans aucun article"}
                </p>
              </div>
              <div>
                <label htmlFor="media-alt" className="mb-1 block text-sm font-medium text-plum">
                  Texte alternatif (ALT)
                </label>
                <textarea
                  key={selected.id}
                  id="media-alt"
                  defaultValue={selected.alt}
                  rows={3}
                  placeholder="Décrivez ce que montre l'image"
                  className={cn(fieldClass, "h-auto py-2")}
                />
                <p className="mt-1 text-xs text-plum/60">Utilisé par Google et par les lecteurs d&apos;écran.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setNotice(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-gold px-4 text-sm font-semibold text-plum outline-none hover:bg-gold/85 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Check aria-hidden="true" className="size-4" />
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(selected.filename)
                      setCopied(true)
                    } catch {
                      // Presse-papiers indisponible : rien à faire.
                    }
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-plum/25 px-4 text-sm font-medium text-plum outline-none hover:border-plum focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Copy aria-hidden="true" className="size-4" />
                  {copied ? "Copié !" : "Copier le nom"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setNotice(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-destructive outline-none hover:bg-destructive/5 focus-visible:ring-3 focus-visible:ring-destructive/30"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Supprimer l&apos;image
              </button>
              {selected.usedIn > 0 && (
                <p className="text-xs text-plum/70">
                  Attention : cette image est utilisée dans un article. La supprimer laisserait un emplacement vide.
                </p>
              )}
              {notice && (
                <NotConnectedNotice>Les modifications seront enregistrées une fois le stockage branché.</NotConnectedNotice>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-plum/70">
              <ImagePlus aria-hidden="true" className="size-8 text-plum/40" />
              Sélectionnez une image pour voir ses détails et modifier sa description.
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export { MediaLibrary }
