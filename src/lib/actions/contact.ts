"use server"

// Formulaire de contact du site : validation serveur (Zod), anti-spam,
// enregistrement en base, e-mail de notification (Reply-To = visiteur).

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { rateLimit } from "@/lib/rate-limit"
import { siteConfig } from "@/config/site"
import { contactSchema } from "@/lib/validations/contact"

export type ContactResult = { ok: true } | { ok: false; message: string }

export async function submitContact(input: unknown, honeypot: string): Promise<ContactResult> {
  // Champ piège invisible : rempli = robot. On fait comme si tout allait bien.
  if (honeypot) return { ok: true }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue"
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return { ok: false, message: "Trop d'envois en peu de temps. Réessayez dans quelques minutes." }
  }

  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: "Certains champs sont invalides. Vérifiez le formulaire." }
  const { name, email, phone, subject, message } = parsed.data

  if (!process.env.DATABASE_URL) {
    return { ok: false, message: "L'envoi n'est pas disponible pour le moment. Écrivez-nous par e-mail." }
  }

  try {
    await db.contact.create({ data: { name, email, phone: phone || null, subject, message } })
    revalidatePath("/admin", "layout")

    const settings = await db.setting.findUnique({ where: { id: 1 }, select: { notificationEmail: true } })
    await sendEmail({
      to: settings?.notificationEmail || siteConfig.contact.email,
      replyTo: email,
      subject: `Nouvelle demande : ${subject} — ${name}`,
      text: [
        `Nouvelle demande reçue depuis le site ${siteConfig.name}.`,
        "",
        `Nom : ${name}`,
        `E-mail : ${email}`,
        `Téléphone : ${phone || "non renseigné"}`,
        `Sujet : ${subject}`,
        "",
        message,
        "",
        "Répondez directement à cet e-mail pour écrire à la personne.",
        "La demande est aussi enregistrée dans l'administration (Contacts).",
      ].join("\n"),
    })
    return { ok: true }
  } catch (error) {
    console.error("[contact]", error)
    // La demande est enregistrée même si l'e-mail échoue (pas de perte).
    return { ok: true }
  }
}
