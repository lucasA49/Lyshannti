// Envoi d'e-mails (Resend). Sans RESEND_API_KEY (développement), l'e-mail
// n'est pas envoyé : son contenu est affiché dans le terminal de `npm run dev`,
// pour pouvoir tout tester en local (liens de réinitialisation compris).

import { Resend } from "resend"

type Email = { to: string; subject: string; text: string; replyTo?: string }

export async function sendEmail({ to, subject, text, replyTo }: Email) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM ?? "Lyshannti <onboarding@resend.dev>"

  if (!apiKey) {
    console.info(
      `\n────── E-mail (non envoyé : RESEND_API_KEY absent) ──────\nÀ : ${to}\nObjet : ${subject}${replyTo ? `\nRépondre à : ${replyTo}` : ""}\n\n${text}\n──────────────────────────────────────────────────────────\n`
    )
    return { delivered: false }
  }

  const { error } = await new Resend(apiKey).emails.send({ from, to, subject, text, replyTo })
  if (error) throw new Error(`Envoi de l'e-mail impossible : ${error.message}`)
  return { delivered: true }
}
