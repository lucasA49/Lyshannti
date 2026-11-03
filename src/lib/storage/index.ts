// Stockage des fichiers (images de la bibliothèque). Interface unique : le jour
// de la mise en ligne, on ajoute un pilote R2 / Vercel Blob / disque du VPS
// sans toucher au reste du code.
//
// Pilote actuel : disque local (STORAGE_DIR, par défaut ./storage/uploads),
// fichiers servis par la route /media/[key].

import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

/** Clés acceptées : noms générés par le serveur uniquement (jamais ceux envoyés). */
export const STORAGE_KEY_PATTERN = /^[a-z0-9-]{10,80}\.webp$/

// turbopackIgnore : dossier choisi à l'exécution, à ne pas embarquer dans le build.
const root = path.resolve(/* turbopackIgnore: true */ process.env.STORAGE_DIR ?? "./storage/uploads")

function filePath(key: string) {
  if (!STORAGE_KEY_PATTERN.test(key)) throw new Error("Clé de stockage invalide.")
  return path.join(/* turbopackIgnore: true */ root, key)
}

export const storage = {
  async put(key: string, data: Buffer) {
    await mkdir(/* turbopackIgnore: true */ root, { recursive: true })
    await writeFile(/* turbopackIgnore: true */ filePath(key), data, { flag: "wx" })
  },
  async get(key: string) {
    try {
      return await readFile(/* turbopackIgnore: true */ filePath(key))
    } catch {
      return null
    }
  },
  async delete(key: string) {
    await rm(/* turbopackIgnore: true */ filePath(key), { force: true })
  },
  url(key: string) {
    return `/media/${key}`
  },
}
