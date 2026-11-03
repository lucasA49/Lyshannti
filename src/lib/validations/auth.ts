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

export const forgotPasswordSchema = z.object({
  email: z.email("Veuillez indiquer une adresse e-mail valide."),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

// Règle simple et robuste (recommandations CNIL / NIST) : la longueur compte
// plus que les caractères imposés. Les mots de passe trop courants seront
// refusés côté serveur.
export const PASSWORD_MIN_LENGTH = 12

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`)
      .max(200, "Le mot de passe est trop long."),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Les deux mots de passe ne correspondent pas.",
    path: ["confirm"],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
