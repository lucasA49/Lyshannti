import { Fragment } from "react"
import { cn } from "cn"

import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { LotusIcon } from "@/components/brand/lotus-icon"
import { frenchTypo } from "@/lib/format"
import type { RichTextDoc, RichTextMark, RichTextNode } from "@/lib/rich-text"

// Affiche le contenu d'un article (JSON Tiptap) avec les composants du site.
// Aucun HTML brut : chaque nœud connu est rendu par un composant React.

const str = (value: unknown) => (typeof value === "string" ? value : "")

// Liens autorisés : relatifs, http(s), mailto, tel (pas de javascript:…).
function safeHref(href: string) {
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href) ? href : undefined
}

function renderText(text: string, marks: RichTextMark[] = []) {
  return marks.reduce<React.ReactNode>((child, mark) => {
    switch (mark.type) {
      case "bold":
        return <strong className="font-semibold text-plum">{child}</strong>
      case "italic":
        return <em>{child}</em>
      case "underline":
        return <u>{child}</u>
      case "link": {
        const href = safeHref(mark.attrs.href)
        if (!href) return child
        const external = /^https?:\/\//i.test(href)
        return (
          <a
            href={href}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            className="rounded-sm font-medium text-plum underline decoration-gold decoration-2 underline-offset-4 outline-none hover:decoration-plum focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {child}
            {external && <span className="sr-only"> (nouvel onglet)</span>}
          </a>
        )
      }
      default:
        return child
    }
  }, frenchTypo(text))
}

function Children({ nodes }: { nodes?: RichTextNode[] }) {
  return (
    <>
      {(nodes ?? []).map((node, index) => (
        <Fragment key={index}>{renderNode(node)}</Fragment>
      ))}
    </>
  )
}

function Figure({ attrs }: { attrs: Record<string, unknown> }) {
  const src = str(attrs.src)
  const alt = str(attrs.alt)
  const caption = str(attrs.caption)
  const width = Number(attrs.width) || undefined
  const height = Number(attrs.height) || undefined

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-gold/25 shadow-md shadow-plum/10">
        {src ? (
          // Images de la bibliothèque média (dimensions enregistrées à l'upload).
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="h-auto w-full" />
        ) : (
          <ImagePlaceholder label={alt} className="aspect-16/9" />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-plum/70 italic">{caption}</figcaption>
      )}
    </>
  )
}

const imageLayouts: Record<string, string> = {
  full: "my-8",
  wide: "my-10 lg:-mx-8",
  left: "my-6 sm:float-left sm:mr-8 sm:mb-4 sm:w-1/2",
  right: "my-6 sm:float-right sm:ml-8 sm:mb-4 sm:w-1/2",
}

function renderNode(node: RichTextNode): React.ReactNode {
  const attrs = node.attrs ?? {}

  switch (node.type) {
    case "text":
      return renderText(node.text ?? "", node.marks)

    case "hardBreak":
      return <br />

    case "paragraph":
      return (
        <p className="my-4 text-lg leading-relaxed text-plum/85">
          <Children nodes={node.content} />
        </p>
      )

    case "heading":
      return Number(attrs.level) === 3 ? (
        <h3 className="mt-8 mb-2 font-heading text-xl font-semibold text-plum">
          <Children nodes={node.content} />
        </h3>
      ) : (
        <h2 className="mt-10 mb-2 flex items-baseline gap-4 font-heading text-2xl font-semibold text-plum sm:text-[1.7rem]">
          <span aria-hidden="true" className="h-0.5 w-7 shrink-0 translate-y-[-0.35em] rounded-full bg-gold" />
          <span>
            <Children nodes={node.content} />
          </span>
        </h2>
      )

    case "bulletList":
      return (
        <ul className="my-4 list-disc space-y-2 pl-6 text-lg text-plum/85 marker:text-gold">
          <Children nodes={node.content} />
        </ul>
      )

    case "orderedList":
      return (
        <ol className="my-4 list-decimal space-y-2 pl-6 text-lg text-plum/85 marker:font-semibold marker:text-plum">
          <Children nodes={node.content} />
        </ol>
      )

    case "listItem":
      return (
        <li className="pl-1 [&>p]:my-0">
          <Children nodes={node.content} />
        </li>
      )

    case "blockquote":
      return (
        <blockquote className="my-6 border-l-2 border-gold pl-5 text-lg text-plum/80 italic">
          <Children nodes={node.content} />
        </blockquote>
      )

    case "horizontalRule":
      return (
        <div aria-hidden="true" className="my-10 flex items-center justify-center gap-4 text-gold">
          <span className="h-px w-16 bg-gold/60" />
          <LotusIcon className="h-5 w-8" />
          <span className="h-px w-16 bg-gold/60" />
        </div>
      )

    case "image":
      return (
        <figure className={imageLayouts[str(attrs.layout)] ?? imageLayouts.full}>
          <Figure attrs={attrs} />
        </figure>
      )

    case "mediaText": {
      const imageRight = attrs.imagePosition === "right"
      return (
        <div className="clear-both my-10 grid items-center gap-6 sm:grid-cols-2 sm:gap-8">
          <figure className={cn(imageRight && "sm:order-2")}>
            <Figure attrs={attrs} />
          </figure>
          <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <Children nodes={node.content} />
          </div>
        </div>
      )
    }

    case "pullQuote":
      return (
        <figure className="relative clear-both my-10 overflow-hidden rounded-3xl bg-linear-to-r from-blush via-blush/70 to-blush/40 px-6 py-8 sm:px-10">
          <LotusIcon aria-hidden="true" strokeWidth={1.2} className="pointer-events-none absolute -right-4 -bottom-4 h-28 w-44 text-gold/50" />
          <div className="relative flex gap-5">
            <span aria-hidden="true" className="font-heading text-6xl leading-none text-gold">
              &ldquo;
            </span>
            <div className="border-l-2 border-gold/70 pl-5">
              <blockquote className="space-y-2 font-heading text-xl leading-snug text-plum italic sm:text-2xl">
                {(node.content ?? []).map((paragraph, index) => (
                  <p key={index}>
                    <Children nodes={paragraph.content} />
                  </p>
                ))}
              </blockquote>
              {str(attrs.author) && (
                <figcaption className="mt-3 text-sm font-medium tracking-wide text-plum/75">
                  — {str(attrs.author)}
                </figcaption>
              )}
            </div>
          </div>
        </figure>
      )

    case "callout":
      return (
        <aside className="clear-both my-8 rounded-2xl border border-gold/40 bg-gold/15 px-6 py-5 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <Children nodes={node.content} />
        </aside>
      )

    default:
      return null
  }
}

function RichText({ doc }: { doc: RichTextDoc }) {
  return (
    <div className="after:clear-both after:table after:content-['']">
      <Children nodes={doc.content} />
    </div>
  )
}

export { RichText }
