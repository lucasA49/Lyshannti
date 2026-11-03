import { z } from "zod"

// Schémas des formulaires d'authentification de l'admin : utilisés côté client
// maintenant, et à réutiliser côté serveur quand l'authentification sera branchée.
// Messages volontairement génériques (ne jamais dire si l'email existe).

export const loginSchema = z.object({
  email: z.email("Veuillez indiquer une adresse e-mail valide."),
  password: z.string().min(1, "Veuillez indiquer votre mot de passe.").max(200),
  remember: z.boolean(),
})

export type LoginInput = z.infer<typeof loginSchema>
