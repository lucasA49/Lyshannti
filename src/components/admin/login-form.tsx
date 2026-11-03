"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Mail } from "lucide-react"

import {
  FieldError,
  FieldIcon,
  NotConnectedNotice,
  PasswordInput,
  authFieldClass,
  authLinkClass,
  authSubmitClass,
} from "@/components/admin/auth-fields"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

function LoginForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", remember: false },
  })

  // TODO backend : authentification côté serveur (hash du mot de passe,
  // limitation des tentatives, session sécurisée) — voir CLAUDE.md, section Sécurité.
  const onSubmit = () => setSubmitted(true)

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="login-email" className="sr-only">
          Adresse e-mail
        </label>
        <div className="relative">
          <FieldIcon>
            <Mail className="size-5" />
          </FieldIcon>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            placeholder="Adresse e-mail"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className={authFieldClass}
            {...register("email")}
          />
        </div>
        <FieldError id="login-email-error" message={errors.email?.message} />
      </div>

      <PasswordInput
        id="login-password"
        label="Mot de passe"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-3 text-plum">
          <input
            type="checkbox"
            className="size-5 cursor-pointer rounded border-plum/40 accent-plum"
            {...register("remember")}
          />
          Se souvenir de moi
        </label>
        <Link href="/admin/mot-de-passe-oublie" className={authLinkClass}>
          Mot de passe oublié&nbsp;?
        </Link>
      </div>

      <button type="submit" disabled={isSubmitting} className={authSubmitClass}>
        Se connecter
        <ArrowRight />
      </button>

      {submitted && (
        <NotConnectedNotice>
          La connexion n&apos;est pas encore activée : l&apos;authentification sera branchée avec le backend.
        </NotConnectedNotice>
      )}
    </form>
  )
}

export { LoginForm }
