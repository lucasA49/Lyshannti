"use client"

import { NodeViewContent, NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react"
import { AlignCenter, AlignLeft, AlignRight, ArrowLeftRight, Maximize2, Trash2 } from "lucide-react"
import { cn } from "cn"

import { ImagePlaceholder } from "@/components/ui/image-placeholder"

// Aperçus des blocs image dans l'éditeur (le rendu final est celui de RichText).

const toolButton =
  "flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-plum outline-none hover:bg-blush focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:bg-plum aria-pressed:text-blush"

function ImagePreview({ src, alt }: { src?: string; alt: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="h-auto w-full rounded-2xl" />
  ) : (
    <ImagePlaceholder label={alt || "Image sans texte alternatif"} className="aspect-16/9 rounded-2xl" />
  )
}

function AltField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-1 items-center gap-2 text-xs text-plum/75">
      ALT
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Décrivez l'image (obligatoire pour le SEO et l'accessibilité)"
        className={cn(
          "h-8 min-w-0 flex-1 rounded-lg border bg-white px-2 text-sm text-plum outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          value ? "border-plum/20" : "border-gold"
        )}
      />
    </label>
  )
}

const layouts = [
  { value: "full", label: "Pleine largeur", icon: AlignCenter },
  { value: "wide", label: "Élargie", icon: Maximize2 },
  { value: "left", label: "À gauche", icon: AlignLeft },
  { value: "right", label: "À droite", icon: AlignRight },
] as const

export function ImageNodeView({ node, updateAttributes, deleteNode, selected }: ReactNodeViewProps) {
  const { src, alt, caption, layout } = node.attrs as { src?: string; alt: string; caption: string; layout: string }

  return (
    <NodeViewWrapper
      as="figure"
      data-layout={layout}
      className={cn(
        "my-6 rounded-3xl border-2 p-3 transition-colors",
        selected ? "border-gold" : "border-transparent hover:border-gold/40",
        (layout === "left" || layout === "right") && "sm:w-1/2",
        layout === "right" && "sm:ml-auto"
      )}
    >
      <div contentEditable={false} className="space-y-2">
        <ImagePreview src={src} alt={alt} />
        <div role="group" aria-label="Disposition de l'image" className="flex flex-wrap items-center gap-1">
          {layouts.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={layout === value}
              onClick={() => updateAttributes({ layout: value })}
              className={toolButton}
            >
              <Icon aria-hidden="true" className="size-3.5" />
              {label}
            </button>
          ))}
          <button type="button" onClick={deleteNode} className={cn(toolButton, "ml-auto text-destructive")}>
            <Trash2 aria-hidden="true" className="size-3.5" />
            Retirer
          </button>
        </div>
        <AltField value={alt} onChange={(value) => updateAttributes({ alt: value })} />
        <input
          value={caption}
          onChange={(event) => updateAttributes({ caption: event.target.value })}
          placeholder="Légende (facultatif)"
          aria-label="Légende de l'image"
          className="h-8 w-full rounded-lg border border-plum/15 bg-white px-2 text-center text-sm text-plum/80 italic outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </div>
    </NodeViewWrapper>
  )
}

export function MediaTextNodeView({ node, updateAttributes, deleteNode, selected }: ReactNodeViewProps) {
  const { src, alt, imagePosition } = node.attrs as { src?: string; alt: string; imagePosition: "left" | "right" }

  return (
    <NodeViewWrapper
      className={cn(
        "my-8 rounded-3xl border-2 p-3 transition-colors",
        selected ? "border-gold" : "border-dashed border-gold/40"
      )}
    >
      <div contentEditable={false} className="mb-2 flex flex-wrap items-center gap-1">
        <span className="mr-2 text-xs font-semibold tracking-wide text-plum/60 uppercase">Image + texte</span>
        <button
          type="button"
          onClick={() => updateAttributes({ imagePosition: imagePosition === "left" ? "right" : "left" })}
          className={toolButton}
        >
          <ArrowLeftRight aria-hidden="true" className="size-3.5" />
          Image à {imagePosition === "left" ? "droite" : "gauche"}
        </button>
        <button type="button" onClick={deleteNode} className={cn(toolButton, "ml-auto text-destructive")}>
          <Trash2 aria-hidden="true" className="size-3.5" />
          Retirer
        </button>
      </div>
      <div className="grid items-center gap-4 sm:grid-cols-2">
        <div contentEditable={false} className={cn("space-y-2", imagePosition === "right" && "sm:order-2")}>
          <ImagePreview src={src} alt={alt} />
          <AltField value={alt} onChange={(value) => updateAttributes({ alt: value })} />
        </div>
        <NodeViewContent className="min-h-16 rounded-2xl bg-white/60 px-3 [&_p]:my-2" />
      </div>
    </NodeViewWrapper>
  )
}
