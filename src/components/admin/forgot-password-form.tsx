"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Mail, Send } from "lucide-react"

import {
  FieldError,
  FieldIcon,
  authFieldClass,
  authLinkClass,
  authSubmitClass,
} from "@/components/admin/auth-fields"
import { requestPasswordReset, type PasswordResult } from "@/lib/actions/password-reset"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth"

function ForgotPasswordForm() {
  const [result, setResult] = useState<PasswordResult | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  })

  // Réponse toujours identique (on ne révèle pas si l'adresse a un compte).
  const onSubmit = async (values: ForgotPasswordInput) => setResult(await requestPasswordReset(values))

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="forgot-email" className="sr-only">
          Adresse e-mail
        </label>
        <div className="relative">
          <FieldIcon>
            <Mail className="size-5" />
          </FieldIcon>
          <input
            id="forgot-email"
            type="email"
            autoComplete="username"
            placeholder="Adresse e-mail"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "forgot-email-error" : undefined}
            className={authFieldClass}
            {...register("email")}
          />
        </div>
        <FieldError id="forgot-email-error" message={errors.email?.message} />
      </div>

      <button type="submit" disabled={isSubmitting} className={authSubmitClass}>
        Envoyer le lien
        <Send />
      </button>

      {result && (
        <p role="status" className="rounded-xl bg-white/70 px-4 py-3 text-sm text-plum">
          {result.message}
        </p>
      )}

      <p className="text-center">
        <Link href="/admin/connexion" className={`${authLinkClass} inline-flex items-center gap-2`}>
          <ArrowLeft aria-hidden="true" className="size-4" />
          Retour à la connexion
        </Link>
      </p>
    </form>
  )
}

export { ForgotPasswordForm }
