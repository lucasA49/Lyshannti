"use server"

// Actions sur les demandes de contact (admin) : statut et suppression.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import type { ActionResult } from "@/lib/admin/actions/articles"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"

const idSchema = z.string().min(1).max(64)
const statusSchema = z.enum(["NEW", "IN_PROGRESS", "DONE"])

const labels = { NEW: "Nouveau", IN_PROGRESS: "En cours", DONE: "Traité" } as const

export async function setContactStatus(id: string, status: string): Promise<ActionResult> {
  await requireAdmin()
  const parsedId = idSchema.safeParse(id)
  const parsedStatus = statusSchema.safeParse(status)
  if (!parsedId.success || !parsedStatus.success) return { ok: false, message: "Demande ou statut invalide." }

  await db.contact.update({ where: { id: parsedId.data }, data: { status: parsedStatus.data } })
  revalidatePath("/admin", "layout")
  return { ok: true, message: `Statut : ${labels[parsedStatus.data]}.` }
}

/** Suppression définitive (droit à l'effacement), puis retour à la liste. */
export async function deleteContact(id: string): Promise<ActionResult> {
  await requireAdmin()
  const parsed = idSchema.safeParse(id)
  if (!parsed.success) return { ok: false, message: "Demande introuvable." }

  await db.contact.delete({ where: { id: parsed.data } })
  revalidatePath("/admin", "layout")
  redirect("/admin/contacts")
}
