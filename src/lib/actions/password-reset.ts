"use server"

// « Mot de passe oublié » et réinitialisation (admin).
//
// - Réponse identique que l'e-mail existe ou non (aucune fuite d'information).
// - Jeton aléatoire (32 octets) envoyé par e-mail ; seule son empreinte SHA-256
//   est stockée. Usage unique, valable 30 minutes.
// - Le nouveau mot de passe est haché (bcrypt, coût 12) et `sessionVersion`
//   est incrémenté : toutes les sessions ouvertes sont fermées.

import { createHash, randomBytes } from "node:crypto"
import { headers } from "next/headers"
import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { rateLimit } from "@/lib/rate-limit"
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth"

const TOKEN_TTL_MS = 30 * 60 * 1000

export type PasswordResult = { ok: true; message: string } | { ok: false; message: string }

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex")

export async function requestPasswordReset(input: unknown): Promise<PasswordResult> {
  const generic: PasswordResult = {
    ok: true,
    message:
      "Si un compte correspond à cette adresse, un e-mail contenant un lien de réinitialisation vient de vous être envoyé. Ce lien est valable 30 minutes.",
  }

  const parsed = forgotPasswordSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: "Veuillez indiquer une adresse e-mail valide." }
  const email = parsed.data.email.toLowerCase()

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue"
  if (!rateLimit(`reset:ip:${ip}`, 5, 15 * 60 * 1000) || !rateLimit(`reset:email:${email}`, 3, 15 * 60 * 1000)) {
    return generic
  }

  const user = await db.user.findUnique({ where: { email }, select: { id: true, name: true } })
  if (!user) return generic

  const token = randomBytes(32).toString("base64url")
  await db.passwordResetToken.create({
    data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + TOKEN_TTL_MS) },
  })

  const base = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "")
  await sendEmail({
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    text: [
      `Bonjour ${user.name},`,
      "",
      "Vous avez demandé à réinitialiser le mot de passe de votre espace d'administration.",
      "Cliquez sur ce lien pour en choisir un nouveau (valable 30 minutes, une seule fois) :",
      "",
      `${base}/admin/reinitialiser/?token=${token}`,
      "",
      "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail :",
      "votre mot de passe actuel reste valable.",
    ].join("\n"),
  })
  return generic
}

export async function resetPassword(token: string, input: unknown): Promise<PasswordResult> {
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Mot de passe invalide." }

  const record = await db.passwordResetToken.findUnique({ where: { tokenHash: hashToken(String(token)) } })
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { ok: false, message: "Ce lien est invalide ou a expiré. Demandez-en un nouveau." }
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)
  await db.$transaction([
    db.user.update({
      where: { id: record.userId },
      data: { passwordHash, sessionVersion: { increment: 1 } },
    }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    // Les autres liens encore valides de ce compte deviennent inutilisables.
    db.passwordResetToken.deleteMany({ where: { userId: record.userId, usedAt: null, id: { not: record.id } } }),
  ])

  return { ok: true, message: "Votre mot de passe a été modifié. Vous pouvez vous connecter." }
}
