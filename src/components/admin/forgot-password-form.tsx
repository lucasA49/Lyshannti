"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Mail, Send } from "lucide-react"

import {
  FieldError,
  FieldIcon,
  NotConnectedNotice,
  authFieldClass,
  authLinkClass,
  authSubmitClass,
} from "@/components/admin/auth-fields"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth"

function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  })

  // TODO backend : si l'e-mail correspond à un compte admin, créer un jeton
  // aléatoire (haché en base, usage unique, 30 min) et envoyer le lien
  // /admin/reinitialiser?token=… via Resend. Réponse identique dans tous les
  // cas (on ne révèle jamais si l'adresse existe) + limitation des demandes.
  const onSubmit = () => setSubmitted(true)

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

      {submitted && (
        <NotConnectedNotice>
          L&apos;envoi des e-mails n&apos;est pas encore activé. Une fois le backend branché, ce
          message sera&nbsp;: «&nbsp;Si un compte correspond à cette adresse, un e-mail contenant un
          lien de réinitialisation vient de vous être envoyé. Ce lien est valable 30 minutes.&nbsp;»
        </NotConnectedNotice>
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
