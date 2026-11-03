"use server"

// Profil de l'admin connecté : nom / e-mail, mot de passe, déconnexion partout.
// Changer de mot de passe (ou « déconnecter partout ») incrémente
// sessionVersion : toutes les sessions ouvertes sont fermées.

import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import type { ActionResult } from "@/lib/admin/actions/articles"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { PASSWORD_MIN_LENGTH } from "@/lib/validations/auth"

const profileSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court.").max(60, "Nom trop long."),
  email: z.email("E-mail invalide."),
})

export async function updateProfile(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin()
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Profil invalide." }

  const email = parsed.data.email.toLowerCase()
  const other = await db.user.findUnique({ where: { email }, select: { id: true } })
  if (other && other.id !== admin.id) return { ok: false, message: "Cet e-mail est déjà utilisé par un autre compte." }

  await db.user.update({ where: { id: admin.id }, data: { name: parsed.data.name, email } })
  revalidatePath("/admin", "layout")
  return { ok: true, message: "Profil enregistré." }
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "Indiquez votre mot de passe actuel."),
    password: z.string().min(PASSWORD_MIN_LENGTH, `Au moins ${PASSWORD_MIN_LENGTH} caractères.`).max(200),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, { message: "Les deux mots de passe ne correspondent pas." })

export async function changePassword(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin()
  const parsed = passwordSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Mot de passe invalide." }

  const user = await db.user.findUniqueOrThrow({ where: { id: admin.id }, select: { passwordHash: true } })
  if (!(await bcrypt.compare(parsed.data.current, user.passwordHash))) {
    return { ok: false, message: "Mot de passe actuel incorrect." }
  }

  await db.user.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.password, 12), sessionVersion: { increment: 1 } },
  })
  return { ok: true, message: "Mot de passe modifié. Reconnectez-vous avec le nouveau mot de passe." }
}

export async function signOutEverywhere(): Promise<ActionResult> {
  const admin = await requireAdmin()
  await db.user.update({ where: { id: admin.id }, data: { sessionVersion: { increment: 1 } } })
  return { ok: true, message: "Toutes les sessions sont fermées, y compris celle-ci." }
}
