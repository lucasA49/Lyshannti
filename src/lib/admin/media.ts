// Bibliothèque d'images (page Médias de l'admin) : SEUL point de lecture.
// Demain : table media + stockage des fichiers (à choisir : Vercel Blob, S3/R2…).
// À l'envoi, le serveur vérifiera le type réel du fichier, sa taille, le
// renommera, et générera les formats WebP/AVIF ; jamais d'exécution de fichier.

import { demoMedia } from "@/content/admin.placeholder"

export const MEDIA_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]
export const MEDIA_MAX_SIZE_MB = 10

export type MediaItem = (typeof demoMedia)[number]

export async function getMediaLibrary(): Promise<MediaItem[]> {
  return [...demoMedia].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
