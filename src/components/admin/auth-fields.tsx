"use client"

import { useState } from "react"
import { Eye, EyeOff, Info, Lock } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button-variants"

// Éléments communs des formulaires d'authentification de l'admin.

export const authFieldClass =
  "h-14 w-full rounded-2xl border border-plum/25 bg-white/60 pl-14 text-base text-plum outline-none transition-colors placeholder:text-plum/60 focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"

export const authSubmitClass = cn(
  buttonVariants({ variant: "gold" }),
  "mt-2 h-14 w-full gap-3 bg-linear-to-b from-[#f7dc9f] to-gold font-heading text-xl font-semibold shadow-md shadow-plum/20 sm:mx-auto sm:flex sm:w-5/6 [&_svg:not([class*='size-'])]:size-5"
)

export const authLinkClass =
  "rounded-sm font-medium text-plum underline underline-offset-4 outline-none hover:decoration-gold focus-visible:ring-3 focus-visible:ring-ring/50"

export function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex w-14 items-center justify-center text-plum">
      {children}
      <span className="absolute right-0 h-6 w-px bg-plum/20" />
    </span>
  )
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-sm text-destructive">
      {message}
    </p>
  )
}

// Champ mot de passe avec bouton « afficher / masquer ».
export function PasswordInput({
  id,
  label,
  autoComplete,
  error,
  describedBy,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & {
  id: string
  label: string
  autoComplete: "current-password" | "new-password"
  error?: string
  describedBy?: string
}) {
  const [visible, setVisible] = useState(false)
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <FieldIcon>
          <Lock className="size-5" />
        </FieldIcon>
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={[error && errorId, describedBy].filter(Boolean).join(" ") || undefined}
          className={cn(authFieldClass, "pr-14")}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={visible}
          aria-controls={id}
          className="absolute inset-y-0 right-1 my-auto flex size-12 items-center justify-center rounded-xl text-plum outline-none hover:bg-white/60 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {visible ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
        </button>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

// Message affiché tant que le backend n'est pas branché (aucune fausse réussite).
export function NotConnectedNotice({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="flex items-start gap-2 rounded-xl bg-white/60 px-4 py-3 text-sm text-plum">
      <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}
