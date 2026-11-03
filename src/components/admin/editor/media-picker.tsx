"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search, Upload, X } from "lucide-react"
import { cn } from "cn"

import { uploadMedia } from "@/lib/admin/actions/media"
import type { PickerMedia } from "@/lib/admin/article-types"

// Sélecteur d'image de la bibliothèque (boîte de dialogue native).
// On peut aussi y ajouter une image depuis l'ordinateur : elle est envoyée,
// optimisée, puis apparaît en tête de liste.
function MediaPicker({
  open,
  media,
  title,
  onClose,
  onSelect,
}: {
  open: boolean
  media: PickerMedia[]
  title: string
  onClose: () => void
  onSelect: (item: PickerMedia) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [uploading, startUpload] = useTransition()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const normalized = query.toLowerCase().trim()
  const visible = media.filter((item) => !normalized || `${item.filename} ${item.alt}`.toLowerCase().includes(normalized))

  const upload = (files: FileList | null) => {
    if (!files?.length) return
    startUpload(async () => {
      setError(null)
      for (const file of [...files]) {
        const formData = new FormData()
        formData.append("file", file)
        const response = await uploadMedia(formData)
        if (!response.ok) setError(response.message)
      }
      router.refresh()
    })
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="media-picker-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto w-[min(56rem,calc(100vw-2rem))] max-w-none rounded-3xl border border-gold/30 bg-white p-0 text-plum shadow-2xl backdrop:bg-plum/60"
    >
      <div className="flex max-h-[85dvh] flex-col">
        <div className="flex items-center gap-3 border-b border-plum/10 p-4 sm:p-5">
          <h2 id="media-picker-title" className="flex-1 font-heading text-xl font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-10 items-center justify-center rounded-xl outline-none hover:bg-blush focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-plum/10 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="relative flex-1">
            <label htmlFor="picker-search" className="sr-only">
              Rechercher une image
            </label>
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-plum/60" />
            <input
              id="picker-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher…"
              className="h-10 w-full rounded-xl border border-plum/20 bg-[#faf3f1] pr-3 pl-10 text-sm outline-none focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
          <label
            className={cn(
              "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-gold px-4 text-sm font-semibold focus-within:ring-3 focus-within:ring-ring/50 hover:bg-gold/85",
              uploading && "pointer-events-none opacity-60"
            )}
          >
            {uploading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Upload aria-hidden="true" className="size-4" />}
            {uploading ? "Envoi…" : "Ajouter depuis l'ordinateur"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="sr-only"
              onChange={(event) => {
                upload(event.target.files)
                event.target.value = ""
              }}
            />
          </label>
        </div>

        {error && (
          <p role="alert" className="mx-4 mt-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm sm:mx-5">
            {error}
          </p>
        )}

        <div className="overflow-y-auto p-4 sm:p-5">
          {visible.length === 0 ? (
            <p className="rounded-2xl bg-blush/30 px-4 py-8 text-center text-sm text-plum/75">
              {media.length === 0 ? "La bibliothèque est vide : ajoutez une image depuis votre ordinateur." : "Aucune image ne correspond."}
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {visible.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="w-full overflow-hidden rounded-2xl border-2 border-transparent text-left outline-none hover:border-gold focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.alt} loading="lazy" className="aspect-square w-full object-cover" />
                    <span className="block truncate bg-[#faf3f1] px-2 py-1.5 text-xs">{item.filename}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </dialog>
  )
}

export { MediaPicker }
