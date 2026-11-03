"use client"

import { useState } from "react"
import Link from "next/link"
import { EditorContent, useEditor } from "@tiptap/react"
import { ArrowLeft, Clock, Eye, PenLine, Save, Send } from "lucide-react"
import { cn } from "cn"

import { NotConnectedNotice } from "@/components/admin/auth-fields"
import { articleExtensions } from "@/components/admin/editor/extensions"
import { EditorToolbar } from "@/components/admin/editor/editor-toolbar"
import {
  OrganisationPanel,
  PublishPanel,
  SeoPanel,
  type ArticleMeta,
} from "@/components/admin/editor/editor-sidebar"
import { RichText } from "@/components/blog/rich-text"
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

// Éditeur d'article : titre, chapô, contenu en blocs (Tiptap) et réglages.
// L'écriture, la mise en page et l'aperçu fonctionnent ; l'enregistrement et la
// publication seront branchés avec le backend (Server Actions + Zod + session).
function ArticleEditor({ categories }: { categories: { slug: string; name: string }[] }) {
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [meta, setMeta] = useState<ArticleMeta>({
    publishMode: "draft",
    scheduledAt: "",
    category: "",
    tags: "",
    coverAlt: "",
    slug: "",
    slugEdited: false,
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
  })
  const [stats, setStats] = useState<ContentStats>(() => analyse(emptyDoc))
  const [preview, setPreview] = useState(false)
  const [notice, setNotice] = useState(false)

  const editor = useEditor({
    extensions: articleExtensions,
    content: emptyDoc,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "article-editor min-h-96 py-6 outline-none",
        "aria-label": "Contenu de l'article",
      },
    },
    onUpdate: ({ editor: e }) => setStats(analyse(e.getJSON() as RichTextDoc)),
  })

  const updateMeta = (patch: Partial<ArticleMeta>) => setMeta((current) => ({ ...current, ...patch }))

  const onTitleChange = (value: string) => {
    setTitle(value)
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
          <h1 className="mt-1 font-heading text-3xl font-semibold text-plum">Nouvel article</h1>
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
          {meta.publishMode !== "draft" && (
            <button
              type="button"
              onClick={() => setNotice(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-plum/25 bg-white px-4 text-sm font-medium text-plum outline-none hover:border-plum focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Save aria-hidden="true" className="size-4" />
              Brouillon
            </button>
          )}
          <button
            type="button"
            onClick={() => setNotice(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-plum shadow-sm outline-none hover:bg-gold/85 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {meta.publishMode === "draft" ? <Save aria-hidden="true" className="size-4" /> : <Send aria-hidden="true" className="size-4" />}
            {publishLabel}
          </button>
        </div>
      </div>

      {notice && (
        <div className="mt-4">
          <NotConnectedNotice>
            L&apos;enregistrement n&apos;est pas encore activé : il sera branché avec la base de données.
            Ne fermez pas cette page si vous voulez garder votre texte.
          </NotConnectedNotice>
        </div>
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
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Chapô : 2 ou 3 phrases d'introduction, affichées en tête de l'article et dans Google."
              rows={2}
              className="mt-3 w-full resize-none bg-transparent text-lg leading-relaxed font-medium text-plum outline-none [field-sizing:content] placeholder:text-plum/40"
            />
            {editor && <EditorToolbar editor={editor} />}
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
          <OrganisationPanel meta={meta} categories={categories} onChange={updateMeta} />
          <SeoPanel meta={meta} title={title} excerpt={excerpt} checks={checks} onChange={updateMeta} />
        </div>
      </div>
    </div>
  )
}

export { ArticleEditor }
