"use server"

// Enregistrement des paramètres du site (une seule ligne, id = 1).

import { revalidatePath } from "next/cache"
import { z } from "zod"

import type { ActionResult } from "@/lib/admin/actions/articles"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"

const optionalUrl = z.union([z.literal(""), z.url("Adresse invalide (elle doit commencer par https://).")])
const optionalEmail = z.union([z.literal(""), z.email("E-mail public invalide.")])

const settingsSchema = z.object({
  name: z.string().trim().min(1, "Le nom du site est obligatoire.").max(60),
  tagline: z.string().trim().max(120),
  description: z.string().trim().max(300),
  phone: z.string().trim().max(30),
  email: optionalEmail,
  city: z.string().trim().max(120),
  hours: z.string().trim().max(120),
  instagram: optionalUrl,
  facebook: optionalUrl,
  linkedin: optionalUrl,
  notificationEmail: z.email("E-mail de notification invalide."),
})

export async function saveSettings(input: unknown): Promise<ActionResult> {
  await requireAdmin()
  const parsed = settingsSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Paramètres invalides." }

  const v = parsed.data
  const data = {
    siteName: v.name,
    tagline: v.tagline,
    description: v.description,
    phone: v.phone,
    email: v.email,
    city: v.city,
    hours: v.hours,
    instagramUrl: v.instagram,
    facebookUrl: v.facebook,
    linkedinUrl: v.linkedin,
    notificationEmail: v.notificationEmail,
  }
  await db.setting.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } })

  // Les coordonnées et réseaux apparaissent sur tout le site.
  revalidatePath("/", "layout")
  return { ok: true, message: "Paramètres enregistrés : le site est à jour." }
}
