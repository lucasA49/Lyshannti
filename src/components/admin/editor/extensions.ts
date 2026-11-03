// @tiptap/react ré-exporte @tiptap/core (pas de dépendance directe à ajouter).
import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { ImageNodeView, MediaTextNodeView } from "@/components/admin/editor/node-views"

// Extensions de l'éditeur d'articles. Les noms et attributs des nœuds doivent
// correspondre EXACTEMENT à ceux lus par RichText (src/lib/rich-text.ts) :
// tout nouveau bloc s'ajoute aux deux endroits.

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    articleBlocks: {
      insertImageBlock: (attrs?: { src?: string; alt?: string; layout?: string }) => ReturnType
      insertMediaText: () => ReturnType
      insertPullQuote: () => ReturnType
      insertCallout: () => ReturnType
    }
  }
}

const ImageBlock = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      caption: { default: "" },
      layout: { default: "full" },
      width: { default: null },
      height: { default: null },
    }
  },
  parseHTML: () => [{ tag: "figure[data-type='image']" }],
  renderHTML: ({ HTMLAttributes }) => ["figure", mergeAttributes(HTMLAttributes, { "data-type": "image" })],
  addNodeView: () => ReactNodeViewRenderer(ImageNodeView),
})

const MediaText = Node.create({
  name: "mediaText",
  group: "block",
  content: "(paragraph | heading | bulletList | orderedList)+",
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      imagePosition: { default: "left" },
    }
  },
  parseHTML: () => [{ tag: "div[data-type='media-text']" }],
  renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-type": "media-text" }), 0],
  addNodeView: () => ReactNodeViewRenderer(MediaTextNodeView),
})

const PullQuote = Node.create({
  name: "pullQuote",
  group: "block",
  content: "paragraph+",
  defining: true,
  addAttributes() {
    return { author: { default: "" } }
  },
  parseHTML: () => [{ tag: "figure[data-type='pull-quote']" }],
  renderHTML: ({ HTMLAttributes }) => [
    "figure",
    mergeAttributes(HTMLAttributes, {
      "data-type": "pull-quote",
      class: "my-8 rounded-3xl border-l-4 border-gold bg-blush/60 px-6 py-5 font-heading text-xl italic",
    }),
    0,
  ],
})

const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "(paragraph | bulletList | orderedList)+",
  defining: true,
  parseHTML: () => [{ tag: "aside[data-type='callout']" }],
  renderHTML: ({ HTMLAttributes }) => [
    "aside",
    mergeAttributes(HTMLAttributes, {
      "data-type": "callout",
      class: "my-6 rounded-2xl border border-gold/50 bg-gold/15 px-5 py-3",
    }),
    0,
  ],
})

const paragraph = (text: string) => ({ type: "paragraph", content: [{ type: "text", text }] })

const ArticleBlocks = Node.create({
  name: "articleBlocks",
  addCommands() {
    return {
      insertImageBlock:
        (attrs = {}) =>
        ({ commands }) =>
          commands.insertContent({ type: "image", attrs: { layout: "full", alt: "", ...attrs } }),
      insertMediaText:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: "mediaText", content: [paragraph("Votre texte à côté de l'image…")] }),
      insertPullQuote:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: "pullQuote", content: [paragraph("Votre citation…")] }),
      insertCallout:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: "callout", content: [paragraph("Bon à savoir : …")] }),
    }
  },
})

export const articleExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    // Non affichés par le site : désactivés pour garder un contenu propre.
    code: false,
    codeBlock: false,
    strike: false,
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https", "mailto", "tel"],
    },
  }),
  ImageBlock,
  MediaText,
  PullQuote,
  Callout,
  ArticleBlocks,
]
