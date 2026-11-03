// Types de l'éditeur d'article, partagés serveur / navigateur (aucun accès aux données).

import type { RichTextDoc } from "@/lib/rich-text"

/** Image de la bibliothèque proposée dans le sélecteur. */
export type PickerMedia = { id: string; url: string; alt: string; width: number; height: number; filename: string }

export type PublishMode = "draft" | "now" | "schedule"

/** Article tel qu'édité dans l'admin (création ou modification). */
export type ArticleFormData = {
  id?: string
  title: string
  excerpt: string
  content: RichTextDoc
  slug: string
  categorySlug: string
  tags: string[]
  coverId: string | null
  coverAlt: string
  publishMode: PublishMode
  /** « AAAA-MM-JJTHH:MM » (heure locale du navigateur), pour la programmation. */
  scheduledAt: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
}
