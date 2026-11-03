// Contenu des articles : document JSON produit par l'éditeur Tiptap de l'admin
// (format ProseMirror), stocké tel quel en base (colonne JSONB).
//
// Pourquoi du JSON et pas du HTML :
// - le site affiche chaque bloc avec ses propres composants React → le rendu
//   reste fidèle à la charte quel que soit l'article ;
// - aucun HTML brut n'est injecté dans la page → pas de faille XSS possible ;
// - les blocs de mise en page (image à gauche/droite, image + texte, citation…)
//   sont des nœuds typés que l'autrice place où elle veut dans l'éditeur.
//
// Nœuds reconnus (les autres sont ignorés à l'affichage) :
//   paragraph, heading (2-3), bulletList, orderedList, listItem, blockquote,
//   horizontalRule, hardBreak, text (+ marques bold, italic, underline, link),
//   image       { src?, alt, caption?, layout: "full" | "wide" | "left" | "right" }
//   mediaText   { src?, alt, imagePosition: "left" | "right" } + contenu texte
//   pullQuote   { author? } + contenu (citation mise en avant, avec lotus)
//   callout     + contenu (encadré « bon à savoir »)

export type RichTextMark =
  | { type: "bold" | "italic" | "underline" }
  | { type: "link"; attrs: { href: string } }

export type RichTextNode = {
  type: string
  attrs?: Record<string, unknown>
  content?: RichTextNode[]
  text?: string
  marks?: RichTextMark[]
}

export type RichTextDoc = { type: "doc"; content: RichTextNode[] }

/** Texte brut d'un document (temps de lecture, extrait, recherche). */
export function richTextToPlain(node: RichTextNode | RichTextDoc): string {
  if ("text" in node && node.text) return node.text
  return (node.content ?? []).map(richTextToPlain).join(" ")
}

/** Temps de lecture estimé (≈ 200 mots/minute), calculé à l'enregistrement. */
export function readingMinutes(doc: RichTextDoc) {
  const words = richTextToPlain(doc).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
