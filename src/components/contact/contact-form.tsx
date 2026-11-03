"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, CheckCircle2, ChevronDown, Lock, Send } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button-variants"
import { submitContact, type ContactResult } from "@/lib/actions/contact"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  contactSchema,
  contactSubjects,
  type ContactInput,
} from "@/lib/validations/contact"

const fieldClass =
  "h-12 rounded-xl border-plum/25 bg-white/80 px-4 text-base text-plum placeholder:text-plum/50 focus-visible:border-plum md:text-base"

function Field({
  id,
  label,
  required,
  error,
  className,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-medium text-plum">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-destructive">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function ContactForm({ className }: { className?: string }) {
  const [result, setResult] = useState<ContactResult | null>(null)
  const [honeypot, setHoneypot] = useState("")
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", phone: "", message: "" },
  })

  // Accessibilité : chaque champ annonce son état d'erreur et son message.
  const a11y = (name: keyof ContactInput) => ({
    id: `contact-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  })

  // Envoi à une action serveur (validation, anti-spam, base, e-mail).
  const onSubmit = async (values: ContactInput) => {
    const response = await submitContact(values, honeypot)
    setResult(response)
    if (response.ok) reset()
  }

  return (
    <div
      className={cn(
        "rounded-3xl border border-gold/30 bg-white/60 p-6 shadow-sm shadow-plum/5 sm:p-8",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="hidden h-0.5 w-12 shrink-0 rounded-full bg-gold sm:block" />
        <h2
          id="contact-form-title"
          className="font-heading text-3xl font-semibold text-plum sm:text-4xl"
        >
          Envoyez-nous un message
        </h2>
      </div>
      <p className="mt-3 text-sm text-plum/70">
        Les champs marqués d&apos;un{" "}
        <span aria-hidden="true" className="text-destructive">*</span>
        <span className="sr-only">astérisque</span> sont obligatoires.
      </p>

      <form
        aria-labelledby="contact-form-title"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid gap-5 sm:grid-cols-2"
      >
        {/* Champ piège anti-robots : invisible, ignoré par les humains. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Site web</label>
          <input
            id="contact-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <Field id="contact-name" label="Nom" required error={errors.name?.message}>
          <Input
            {...register("name")}
            {...a11y("name")}
            autoComplete="name"
            required
            className={fieldClass}
          />
        </Field>

        <Field id="contact-email" label="Email" required error={errors.email?.message}>
          <Input
            {...register("email")}
            {...a11y("email")}
            type="email"
            autoComplete="email"
            required
            className={fieldClass}
          />
        </Field>

        <Field id="contact-phone" label="Téléphone" error={errors.phone?.message}>
          <Input
            {...register("phone")}
            {...a11y("phone")}
            type="tel"
            autoComplete="tel"
            className={fieldClass}
          />
        </Field>

        <Field id="contact-subject" label="Sujet" required error={errors.subject?.message}>
          {/* Liste native : la plus fiable au clavier, au lecteur d'écran et sur mobile. */}
          <div className="relative">
            <select
              {...register("subject")}
              {...a11y("subject")}
              required
              defaultValue=""
              className={cn(
                fieldClass,
                "w-full appearance-none border pr-10 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
              )}
            >
              <option value="" disabled>
                Choisissez un sujet
              </option>
              {contactSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-plum"
            />
          </div>
        </Field>

        <Field
          id="contact-message"
          label="Message"
          required
          error={errors.message?.message}
          className="sm:col-span-2"
        >
          <Textarea
            {...register("message")}
            {...a11y("message")}
            required
            rows={6}
            className={cn(fieldClass, "h-auto min-h-36 py-3 [field-sizing:fixed]")}
          />
        </Field>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              buttonVariants(),
              "h-13 w-full gap-3 rounded-xl bg-linear-to-r from-plum to-[color-mix(in_oklch,#211325_85%,#eed8d4)] text-base font-semibold text-blush shadow-md shadow-plum/20 hover:opacity-90 [&_svg:not([class*='size-'])]:size-5"
            )}
          >
            <Send />
            {isSubmitting ? "Envoi…" : "Envoyer ma demande"}
          </button>

          {result && (
            <p
              role={result.ok ? "status" : "alert"}
              className={cn(
                "mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-sm text-plum",
                result.ok ? "bg-gold/25" : "border border-destructive/30 bg-white"
              )}
            >
              {result.ok ? (
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              ) : (
                <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
              )}
              {result.ok
                ? "Merci, votre message a bien été envoyé. Nous vous répondons au plus vite."
                : result.message}
            </p>
          )}

          <p className="mt-4 flex items-start justify-center gap-2 text-center text-sm text-plum/75">
            <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>
              Vos informations sont confidentielles et ne seront jamais
              partagées.{" "}
              <Link
                href="/politique-de-confidentialite"
                className="rounded-sm underline underline-offset-2 outline-none hover:text-plum focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                En savoir plus
              </Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  )
}

export { ContactForm }
