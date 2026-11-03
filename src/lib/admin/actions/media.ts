"use server"

// Bibliothèque d'images : envoi, description (ALT), suppression.
//
// Sécurité de l'envoi :
// - session admin vérifiée, une image par requête, 10 Mo maximum ;
// - le format est lu dans le contenu du fichier (sharp), pas dans son nom ;
// - l'image est ré-encodée en WebP : métadonnées (EXIF, position GPS) retirées,
//   tout contenu caché neutralisé, poids réduit ;
// - nom de fichier généré par le serveur ; le nom d'origine n'est qu'affiché.

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import sharp from "sharp"
import { z } from "zod"

import type { ActionResult } from "@/lib/admin/actions/articles"
import { MEDIA_MAX_SIZE_MB } from "@/lib/admin/media"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { storage } from "@/lib/storage"

const ACCEPTED_FORMATS = new Set(["jpeg", "png", "webp", "avif", "heif"])
const MAX_WIDTH = 2400

function refresh() {
  revalidatePath("/admin", "layout")
  revalidatePath("/blog", "layout")
}

function noDatabase(): ActionResult | null {
  return process.env.DATABASE_URL ? null : { ok: false, message: "Base de données non configurée." }
}

export async function uploadMedia(formData: FormData): Promise<ActionResult> {
  const blocked = noDatabase()
  if (blocked) return blocked
  const admin = await requireAdmin()

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Aucun fichier reçu." }
  if (file.size > MEDIA_MAX_SIZE_MB * 1024 * 1024) {
    return { ok: false, message: `« ${file.name} » dépasse ${MEDIA_MAX_SIZE_MB} Mo.` }
  }

  try {
    const input = Buffer.from(await file.arrayBuffer())
    const metadata = await sharp(input).metadata()
    if (!metadata.format || !ACCEPTED_FORMATS.has(metadata.format)) {
      return { ok: false, message: `« ${file.name} » n'est pas une image acceptée (JPG, PNG, WebP ou AVIF).` }
    }

    const { data, info } = await sharp(input)
      .rotate() // applique l'orientation de l'appareil photo avant de retirer l'EXIF
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true })

    const key = `${randomUUID()}.webp`
    await storage.put(key, data)

    await db.media.create({
      data: {
        filename: file.name.slice(0, 200),
        storageKey: key,
        url: storage.url(key),
        mimeType: "image/webp",
        sizeBytes: info.size,
        width: info.width,
        height: info.height,
        uploadedById: admin.id,
      },
    })
    refresh()
    return { ok: true, message: `« ${file.name} » est ajoutée (${Math.round(info.size / 1024)} Ko après optimisation).` }
  } catch (error) {
    console.error("[admin/media] envoi", error)
    return { ok: false, message: `« ${file.name} » n'a pas pu être lue comme une image.` }
  }
}

const altSchema = z.object({ id: z.string().min(1).max(64), alt: z.string().trim().max(250) })

export async function updateMediaAlt(id: string, alt: string): Promise<ActionResult> {
  const blocked = noDatabase()
  if (blocked) return blocked
  await requireAdmin()
  const parsed = altSchema.safeParse({ id, alt })
  if (!parsed.success) return { ok: false, message: "Description trop longue (250 caractères maximum)." }

  await db.media.update({ where: { id: parsed.data.id }, data: { alt: parsed.data.alt } })
  refresh()
  return { ok: true, message: "Description enregistrée." }
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  const blocked = noDatabase()
  if (blocked) return blocked
  await requireAdmin()
  const parsed = z.string().min(1).max(64).safeParse(id)
  if (!parsed.success) return { ok: false, message: "Image introuvable." }

  const media = await db.media.findUnique({ where: { id: parsed.data } })
  if (!media) return { ok: false, message: "Image introuvable." }

  // Les articles qui l'utilisent perdent simplement leur image (onDelete: SetNull).
  await db.media.delete({ where: { id: media.id } })
  await storage.delete(media.storageKey)
  refresh()
  return { ok: true, message: `« ${media.filename} » est supprimée.` }
}
