import { z } from "zod"

// Schéma du formulaire de contact : utilisé côté client maintenant,
// et à réutiliser côté serveur (Server Action) quand le backend sera branché.
export const contactSubjects = [
  "Prendre rendez-vous",
  "Soin du visage",
  "Soin du corps",
  "Accompagnement personnalisé",
  "Autre demande",
] as const

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Veuillez indiquer votre nom.")
    .max(100, "Votre nom est trop long."),
  email: z.email("Veuillez indiquer une adresse email valide."),
  phone: z
    .string()
    .trim()
    .regex(/^$|^[+0-9 .()-]{6,20}$/, "Veuillez indiquer un numéro de téléphone valide."),
  subject: z.enum(contactSubjects, "Veuillez choisir un sujet."),
  message: z
    .string()
    .trim()
    .min(10, "Votre message doit contenir au moins 10 caractères.")
    .max(5000, "Votre message est trop long (5 000 caractères maximum)."),
})

export type ContactInput = z.input<typeof contactSchema>
