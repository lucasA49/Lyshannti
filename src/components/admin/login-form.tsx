"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Eye, EyeOff, Info, Lock, Mail } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button-variants"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

const fieldClass =
  "h-14 w-full rounded-2xl border border-plum/25 bg-white/60 pl-14 text-base text-plum outline-none transition-colors placeholder:text-plum/60 focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex w-14 items-center justify-center text-plum">
      {children}
      <span className="absolute right-0 h-6 w-px bg-plum/20" />
    </span>
  )
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
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
            className={fieldClass}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="login-email-error" className="mt-1.5 text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="login-password" className="sr-only">
          Mot de passe
        </label>
        <div className="relative">
          <FieldIcon>
            <Lock className="size-5" />
          </FieldIcon>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Mot de passe"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            className={cn(fieldClass, "pr-14")}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={showPassword}
            aria-controls="login-password"
            className="absolute inset-y-0 right-1 my-auto flex size-12 items-center justify-center rounded-xl text-plum outline-none hover:bg-white/60 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" className="mt-1.5 text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-3 text-plum">
          <input
            type="checkbox"
            className="size-5 cursor-pointer rounded border-plum/40 accent-plum"
            {...register("remember")}
          />
          Se souvenir de moi
        </label>
        <Link
          href="/admin/mot-de-passe-oublie"
          className="rounded-sm font-medium text-plum underline underline-offset-4 outline-none hover:decoration-gold focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Mot de passe oublié&nbsp;?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          buttonVariants({ variant: "gold" }),
          "mt-2 h-14 w-full gap-3 bg-linear-to-b from-[#f7dc9f] to-gold font-heading text-xl font-semibold shadow-md shadow-plum/20 sm:mx-auto sm:flex sm:w-5/6 [&_svg:not([class*='size-'])]:size-5"
        )}
      >
        Se connecter
        <ArrowRight />
      </button>

      {submitted && (
        <p role="status" className="flex items-start gap-2 rounded-xl bg-white/60 px-4 py-3 text-sm text-plum">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          La connexion n&apos;est pas encore activée : l&apos;authentification sera branchée avec le backend.
        </p>
      )}
    </form>
  )
}

export { LoginForm }
