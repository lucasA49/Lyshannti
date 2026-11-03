"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, ArrowRight, Mail } from "lucide-react"

import {
  FieldError,
  FieldIcon,
  PasswordInput,
  authFieldClass,
  authLinkClass,
  authSubmitClass,
} from "@/components/admin/auth-fields"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

// Messages volontairement génériques : on ne dit jamais si l'e-mail existe.
const errorMessages: Record<string, string> = {
  TooManyAttempts: "Trop de tentatives. Pour votre sécurité, réessayez dans 15 minutes.",
  default: "E-mail ou mot de passe incorrect.",
}

function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", remember: false },
  })

  // Vérification côté serveur par NextAuth (src/lib/auth/options.ts).
  const onSubmit = async (values: LoginInput) => {
    setError(null)
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      remember: String(values.remember),
      redirect: false,
    })
    if (!result || result.error) {
      setError(errorMessages[result?.error ?? ""] ?? errorMessages.default)
      return
    }
    router.replace("/admin")
    router.refresh()
  }

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
        {isSubmitting ? "Connexion…" : "Se connecter"}
        <ArrowRight />
      </button>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-white/70 px-4 py-3 text-sm text-plum">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
          {error}
        </p>
      )}
    </form>
  )
}

export { LoginForm }
