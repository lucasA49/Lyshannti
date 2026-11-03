// Paramètres affichés sur le site public (coordonnées, réseaux, slogan).
// Table settings (modifiable dans /admin/parametres) si la base est disponible ;
// sinon valeurs de siteConfig. Serveur uniquement.

import { siteConfig } from "@/config/site"

export type PublicSettings = {
  tagline: string
  phone: string
  email: string
  city: string
  hours: string
  instagram: string
  facebook: string
  linkedin: string
}

const defaults: PublicSettings = {
  tagline: siteConfig.tagline,
  phone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  city: siteConfig.contact.city,
  hours: siteConfig.contact.hours.short,
  instagram: siteConfig.socials.instagram,
  facebook: siteConfig.socials.facebook,
  linkedin: siteConfig.socials.linkedin,
}

export async function getPublicSettings(): Promise<PublicSettings> {
  if (!process.env.DATABASE_URL) return defaults
  const { db } = await import("@/lib/db")
  const row = await db.setting.findUnique({ where: { id: 1 } })
  if (!row) return defaults
  return {
    tagline: row.tagline,
    phone: row.phone,
    email: row.email,
    city: row.city,
    hours: row.hours,
    instagram: row.instagramUrl,
    facebook: row.facebookUrl,
    linkedin: row.linkedinUrl,
  }
}
