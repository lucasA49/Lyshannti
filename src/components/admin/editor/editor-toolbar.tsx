"use client"

import { useState } from "react"
import { useEditorState, type Editor } from "@tiptap/react"
import {
  Bold,
  Columns2,
  Heading2,
  Heading3,
  ImageIcon,
  Info,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  TextQuote,
  Underline,
  Undo2,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"

// Barre d'outils de l'éditeur : mise en forme du texte et insertion des blocs
// de mise en page (image, image + texte, citation, encadré, séparateur).

function ToolButton({
  icon: Icon,
  label,
  onClick,
  active,
  disabled,
  showLabel,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
  showLabel?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={showLabel ? undefined : label}
      title={label}
      className={cn(
        "flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg text-plum outline-none transition-colors hover:bg-blush focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-35",
        showLabel ? "px-2.5 text-xs font-medium" : "w-9",
        active && "bg-plum text-blush hover:bg-plum"
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      {showLabel && label}
    </button>
  )
}

const Separator = () => <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-plum/15" />

function EditorToolbar({
  editor,
  onPickImage,
}: {
  editor: Editor
  /** Ouvre la bibliothèque pour insérer une image ou un bloc image + texte. */
  onPickImage: (kind: "image" | "mediaText") => void
}) {
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  // Ne se met à jour que lorsque l'état affiché change (performances).
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      paragraph: e.isActive("paragraph"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      link: e.isActive("link"),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      blockquote: e.isActive("blockquote"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })

  const chain = () => editor.chain().focus()

  const openLink = () => {
    setLinkUrl((editor.getAttributes("link").href as string | undefined) ?? "")
    setLinkOpen(true)
  }

  const applyLink = (event: React.FormEvent) => {
    event.preventDefault()
    const url = linkUrl.trim()
    if (url) chain().extendMarkRange("link").setLink({ href: url }).run()
    else chain().extendMarkRange("link").unsetLink().run()
    setLinkOpen(false)
  }

  return (
    <div className="sticky top-16 z-10 -mx-4 border-y border-gold/25 bg-white/95 px-2 py-1.5 backdrop-blur sm:-mx-6 sm:px-4">
      <div role="toolbar" aria-label="Mise en forme" className="flex flex-wrap items-center gap-0.5">
        <ToolButton icon={Undo2} label="Annuler" onClick={() => chain().undo().run()} disabled={!state.canUndo} />
        <ToolButton icon={Redo2} label="Rétablir" onClick={() => chain().redo().run()} disabled={!state.canRedo} />
        <Separator />
        <ToolButton icon={Pilcrow} label="Paragraphe" onClick={() => chain().setParagraph().run()} active={state.paragraph} />
        <ToolButton icon={Heading2} label="Titre de partie" onClick={() => chain().toggleHeading({ level: 2 }).run()} active={state.h2} />
        <ToolButton icon={Heading3} label="Sous-titre" onClick={() => chain().toggleHeading({ level: 3 }).run()} active={state.h3} />
        <Separator />
        <ToolButton icon={Bold} label="Gras" onClick={() => chain().toggleBold().run()} active={state.bold} />
        <ToolButton icon={Italic} label="Italique" onClick={() => chain().toggleItalic().run()} active={state.italic} />
        <ToolButton icon={Underline} label="Souligné" onClick={() => chain().toggleUnderline().run()} active={state.underline} />
        <ToolButton icon={Link2} label="Lien" onClick={openLink} active={state.link} />
        <Separator />
        <ToolButton icon={List} label="Liste à puces" onClick={() => chain().toggleBulletList().run()} active={state.bulletList} />
        <ToolButton icon={ListOrdered} label="Liste numérotée" onClick={() => chain().toggleOrderedList().run()} active={state.orderedList} />
        <ToolButton icon={TextQuote} label="Citation simple" onClick={() => chain().toggleBlockquote().run()} active={state.blockquote} />
        <Separator />
        <ToolButton icon={ImageIcon} label="Image" showLabel onClick={() => onPickImage("image")} />
        <ToolButton icon={Columns2} label="Image + texte" showLabel onClick={() => onPickImage("mediaText")} />
        <ToolButton icon={Quote} label="Citation mise en avant" showLabel onClick={() => chain().insertPullQuote().run()} />
        <ToolButton icon={Info} label="Encadré" showLabel onClick={() => chain().insertCallout().run()} />
        <ToolButton icon={Minus} label="Séparateur" showLabel onClick={() => chain().setHorizontalRule().run()} />
      </div>

      {linkOpen && (
        <form onSubmit={applyLink} className="mt-1.5 flex flex-wrap items-center gap-2 border-t border-plum/10 pt-2">
          <label htmlFor="editor-link" className="text-xs font-medium text-plum">
            Adresse du lien
          </label>
          <input
            id="editor-link"
            autoFocus
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://… ou /blog/… (laisser vide pour retirer)"
            className="h-9 min-w-0 flex-1 rounded-lg border border-plum/20 px-3 text-sm text-plum outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <button type="submit" className="h-9 rounded-lg bg-plum px-3 text-xs font-semibold text-blush">
            Valider
          </button>
          <button type="button" onClick={() => setLinkOpen(false)} className="h-9 rounded-lg px-3 text-xs text-plum hover:bg-blush">
            Annuler
          </button>
        </form>
      )}
    </div>
  )
}

export { EditorToolbar }
