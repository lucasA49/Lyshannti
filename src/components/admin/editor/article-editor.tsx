"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EditorContent, useEditor } from "@tiptap/react"
import { ArrowLeft, Clock, ExternalLink, Eye, PenLine, Save, Send } from "lucide-react"
import { cn } from "cn"

import { MediaPicker } from "@/components/admin/editor/media-picker"
import { articleExtensions } from "@/components/admin/editor/extensions"
import { EditorToolbar } from "@/components/admin/editor/editor-toolbar"
import {
  OrganisationPanel,
  PublishPanel,
  SeoPanel,
  type ArticleMeta,
} from "@/components/admin/editor/editor-sidebar"
import { RichText } from "@/components/blog/rich-text"
import { saveArticle, type SaveArticleResult } from "@/lib/admin/actions/save-article"
import type { ArticleFormData, PickerMedia, PublishMode } from "@/lib/admin/article-types"
import { seoChecks } from "@/lib/admin/seo-checklist"
import { frenchTypo } from "@/lib/format"
import { readingMinutes, richTextToPlain, type RichTextDoc, type RichTextNode } from "@/lib/rich-text"
import { slugify } from "@/lib/slug"

type ContentStats = { doc: RichTextDoc; text: string; imagesWithoutAlt: number; internalLinks: number }

const emptyDoc: RichTextDoc = { type: "doc", content: [{ type: "paragraph" }] }

// Parcourt le document pour les vérifications SEO (images sans ALT, liens internes).
function analyse(doc: RichTextDoc): ContentStats {
  let imagesWithoutAlt = 0
  let internalLinks = 0
  const walk = (node: RichTextNode) => {
    if ((node.type === "image" || node.type === "mediaText") && !String(node.attrs?.alt ?? "").trim()) {
      imagesWithoutAlt++
    }
    for (const mark of node.marks ?? []) {
      if (mark.type === "link" && mark.attrs.href.startsWith("/")) internalLinks++
    }
    node.content?.forEach(walk)
  }
  doc.content.forEach(walk)
  return { doc, text: richTextToPlain(doc), imagesWithoutAlt, internalLinks }
}

type PickerTarget = "cover" | "image" | "mediaText" | null

// Éditeur d'article (création et modification) : titre, chapô, contenu en
// blocs (Tiptap), images de la bibliothèque, publication et réglages SEO.
// L'enregistrement passe par une action serveur (session, Zod, base).
function ArticleEditor({
  categories,
  media,
  initial,
}: {
  categories: { slug: string; name: string }[]
  media: PickerMedia[]
  initial?: ArticleFormData
}) {
  const router = useRouter()
  const initialContent = initial?.content ?? emptyDoc
  const [title, setTitle] = useState(initial?.title ?? "")
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "")
  const [meta, setMeta] = useState<ArticleMeta>({
    publishMode: initial?.publishMode ?? "draft",
    scheduledAt: initial?.scheduledAt ?? "",
    category: initial?.categorySlug ?? "",
    tags: initial?.tags.join(", ") ?? "",
    coverId: initial?.coverId ?? null,
    coverUrl: media.find((item) => item.id === initial?.coverId)?.url ?? null,
    coverAlt: initial?.coverAlt ?? "",
    slug: initial?.slug ?? "",
    slugEdited: Boolean(initial),
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    focusKeyword: initial?.focusKeyword ?? "",
  })
  const [stats, setStats] = useState<ContentStats>(() => analyse(initialContent))
  const [preview, setPreview] = useState(false)
  const [result, setResult] = useState<SaveArticleResult | null>(null)
  const [dirty, setDirty] = useState(false)
  const [picker, setPicker] = useState<PickerTarget>(null)
  const [saving, startSaving] = useTransition()

  // Prévient avant de quitter la page avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  const editor = useEditor({
    extensions: articleExtensions,
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "article-editor min-h-96 py-6 outline-none",
        "aria-label": "Contenu de l'article",
      },
    },
    onUpdate: ({ editor: e }) => {
      setStats(analyse(e.getJSON() as RichTextDoc))
      setDirty(true)
    },
  })

  const updateMeta = (patch: Partial<ArticleMeta>) => {
    setMeta((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  const onTitleChange = (value: string) => {
    setTitle(value)
    setDirty(true)
    // L'adresse suit le titre tant qu'elle n'a pas été modifiée à la main.
    if (!meta.slugEdited) updateMeta({ slug: slugify(value) })
  }

  const checks = seoChecks({
    title,
    excerpt,
    slug: meta.slug,
    metaTitle: meta.metaTitle,
    metaDescription: meta.metaDescription,
    focusKeyword: meta.focusKeyword,
    coverAlt: meta.coverAlt,
    bodyText: `${excerpt} ${stats.text}`,
    imagesWithoutAlt: stats.imagesWithoutAlt,
    internalLinks: stats.internalLinks,
  })

  const minutes = readingMinutes({
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: excerpt }] }, ...stats.doc.content],
  })

  const onPick = (item: PickerMedia) => {
    const attrs = { src: item.url, alt: item.alt, width: item.width, height: item.height }
    if (picker === "cover") updateMeta({ coverId: item.id, coverUrl: item.url, coverAlt: item.alt })
    else if (picker === "image") editor?.chain().focus().insertImageBlock(attrs).run()
    else if (picker === "mediaText") editor?.chain().focus().insertMediaText(attrs).run()
    setPicker(null)
  }

  const save = (mode: PublishMode) => {
    if (!editor) return
    const data: ArticleFormData = {
      id: initial?.id,
      title,
      excerpt,
      // Copie JSON pure : les attributs de ProseMirror sont des objets sans
      // prototype, mal transmis tels quels à une action serveur.
      content: JSON.parse(JSON.stringify(editor.getJSON())) as RichTextDoc,
      slug: meta.slug,
      categorySlug: meta.category,
      tags: meta.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      coverId: meta.coverId,
      coverAlt: meta.coverAlt,
      publishMode: mode,
      // Heure locale du navigateur → date absolue (ISO) pour le serveur.
      scheduledAt: meta.scheduledAt ? new Date(meta.scheduledAt).toISOString() : "",
      metaTitle: meta.metaTitle,
      metaDescription: meta.metaDescription,
      focusKeyword: meta.focusKeyword,
    }
    startSaving(async () => {
      const response = await saveArticle(data)
      setResult(response)
      if (!response.ok) return
      setDirty(false)
      if (mode !== meta.publishMode) setMeta((current) => ({ ...current, publishMode: mode }))
      if (!initial?.id) router.replace(`/admin/articles/${response.id}`)
    })
  }

  const publicUrl = initial?.id && initial.publishMode === "now" && !dirty ? `/blog/${initial.slug}` : null

  const publishLabel =
    meta.publishMode === "now" ? "Publier" : meta.publishMode === "schedule" ? "Programmer" : "Enregistrer"

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-plum/75 outline-none hover:text-plum focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Tous les articles
          </Link>
          <h1 className="mt-1 font-heading text-3xl font-semibold text-plum">
            {initial?.id ? "Modifier l'article" : "Nouvel article"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm text-plum/70">
            <Clock aria-hidden="true" className="size-4" />
            {minutes} min de lecture
          </span>
          <button
            type="button"
            onClick={() => setPreview((value) => !value)}
            aria-pressed={preview}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-plum/25 bg-white px-4 text-sm font-medium text-plum outline-none hover:border-plum focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {preview ? <PenLine aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
            {preview ? "Revenir à l'édition" : "Aperçu"}
          </button>
          {publicUrl && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-plum/25 bg-white px-4 text-sm font-medium text-plum outline-none hover:border-plum focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
              Voir sur le site
            </a>
          )}
          {meta.publishMode !== "draft" && (
            <button
              type="button"
              disabled={saving}
              onClick={() => save("draft")}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-plum/25 bg-white px-4 text-sm font-medium text-plum outline-none hover:border-plum focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Save aria-hidden="true" className="size-4" />
              Brouillon
            </button>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => save(meta.publishMode)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-plum shadow-sm outline-none hover:bg-gold/85 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {meta.publishMode === "draft" ? <Save aria-hidden="true" className="size-4" /> : <Send aria-hidden="true" className="size-4" />}
            {saving ? "Enregistrement…" : publishLabel}
          </button>
        </div>
      </div>

      {result && (
        <p
          role={result.ok ? "status" : "alert"}
          className={cn(
            "mt-4 rounded-xl px-4 py-3 text-sm text-plum",
            result.ok ? "bg-gold/20" : "border border-destructive/30 bg-destructive/5"
          )}
        >
          {result.message}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="min-w-0 rounded-3xl border border-gold/25 bg-white px-4 pt-6 shadow-sm shadow-plum/5 sm:px-6">
          {/* L'éditeur reste monté pendant l'aperçu pour ne rien perdre. */}
          <div className={cn(preview && "hidden")}>
            <label htmlFor="article-title" className="sr-only">
              Titre de l&apos;article
            </label>
            <textarea
              id="article-title"
              value={title}
              onChange={(event) => onTitleChange(event.target.value.replace(/\n/g, " "))}
              placeholder="Titre de l'article"
              rows={1}
              className="w-full resize-none bg-transparent font-heading text-3xl leading-tight font-semibold text-plum italic outline-none [field-sizing:content] placeholder:text-plum/35 sm:text-4xl"
            />
            <label htmlFor="article-excerpt" className="sr-only">
              Chapô (introduction)
            </label>
            <textarea
              id="article-excerpt"
              value={excerpt}
              onChange={(event) => {
                setExcerpt(event.target.value)
                setDirty(true)
              }}
              placeholder="Chapô : 2 ou 3 phrases d'introduction, affichées en tête de l'article et dans Google."
              rows={2}
              className="mt-3 w-full resize-none bg-transparent text-lg leading-relaxed font-medium text-plum outline-none [field-sizing:content] placeholder:text-plum/40"
            />
            {editor && <EditorToolbar editor={editor} onPickImage={setPicker} />}
            <EditorContent editor={editor} />
          </div>

          {preview && (
            <article className="pb-8">
              <p className="text-xs font-semibold tracking-[0.2em] text-plum/60 uppercase">Aperçu</p>
              <h2 className="mt-3 font-heading text-3xl leading-tight font-semibold text-plum italic sm:text-4xl">
                {frenchTypo(title || "Titre de l'article")}
              </h2>
              {excerpt && <p className="mt-6 text-lg leading-relaxed font-medium text-plum">{frenchTypo(excerpt)}</p>}
              <RichText doc={stats.doc} />
            </article>
          )}
        </div>

        <div className="space-y-6">
          <PublishPanel meta={meta} onChange={updateMeta} />
          <OrganisationPanel meta={meta} categories={categories} onChange={updateMeta} onPickCover={() => setPicker("cover")} />
          <SeoPanel meta={meta} title={title} excerpt={excerpt} checks={checks} onChange={updateMeta} />
        </div>
      </div>

      <MediaPicker
        open={picker !== null}
        media={media}
        title={picker === "cover" ? "Image principale" : "Choisir une image"}
        onClose={() => setPicker(null)}
        onSelect={onPick}
      />
    </div>
  )
}

export { ArticleEditor }
