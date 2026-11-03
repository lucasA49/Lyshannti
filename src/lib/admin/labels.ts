// Statuts et libellés de l'admin. Fichier sans accès aux données : il peut être
// importé par les composants « use client ».

export type ContactStatus = "NEW" | "IN_PROGRESS" | "DONE"
export type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED"
export type SeoIssue = "metaDescription" | "imageAlt" | "coverImage" | "focusKeyword"

export const contactStatusLabels: Record<ContactStatus, string> = {
  NEW: "Nouveau",
  IN_PROGRESS: "En cours",
  DONE: "Traité",
}

export const postStatusLabels: Record<PostStatus, string> = {
  DRAFT: "Brouillon",
  SCHEDULED: "Programmé",
  PUBLISHED: "Publié",
}

export const seoIssueLabels: Record<SeoIssue, string> = {
  metaDescription: "Meta description manquante",
  imageAlt: "Texte alternatif (ALT) d'image manquant",
  coverImage: "Image principale manquante",
  focusKeyword: "Mot-clé principal manquant",
}
