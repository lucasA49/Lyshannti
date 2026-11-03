"use client"

import { useState } from "react"
import { Save } from "lucide-react"

import { NotConnectedNotice } from "@/components/admin/auth-fields"

// Paramètres du site, modifiables par la cliente sans toucher au code.
// Demain : table settings (une ligne), lue par les pages publiques (coordonnées,
// réseaux, textes) ; chaque enregistrement régénère les pages concernées.

export type SiteSettings = {
  name: string
  tagline: string
  description: string
  phone: string
  email: string
  city: string
  hours: string
  instagram: string
  facebook: string
  linkedin: string
  notificationEmail: string
}

const fieldClass =
  "h-10 w-full rounded-xl border border-plum/20 bg-[#faf3f1] px-3 text-sm text-plum outline-none placeholder:text-plum/50 focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/40"

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-3xl border border-gold/25 bg-white p-5 shadow-sm shadow-plum/5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
        <div>
          <h2 id={id} className="flex items-center gap-3 font-heading text-xl font-semibold text-plum">
            <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-gold" />
            {title}
          </h2>
          <p className="mt-1 text-sm text-plum/70">{description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">{children}</div>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  hint,
  wide,
  children,
}: {
  id: string
  label: string
  hint?: string
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-plum">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-plum/60">{hint}</p>}
    </div>
  )
}

function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [values, setValues] = useState(initial)
  const [notice, setNotice] = useState(false)

  const input = (key: keyof SiteSettings, props: React.ComponentProps<"input"> = {}) => (
    <input
      id={`setting-${key}`}
      value={values[key]}
      onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
      className={fieldClass}
      {...props}
    />
  )

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setNotice(true)
      }}
      className="space-y-6"
    >
      <Section id="settings-site" title="Le site" description="Nom, slogan et description utilisés dans l'en-tête, le pied de page et Google.">
        <Field id="setting-name" label="Nom du site">
          {input("name", { required: true })}
        </Field>
        <Field id="setting-tagline" label="Slogan">
          {input("tagline")}
        </Field>
        <Field id="setting-description" label="Description" hint="Environ 150 caractères : elle apparaît dans les résultats Google." wide>
          <textarea
            id="setting-description"
            value={values.description}
            onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
            rows={3}
            className={`${fieldClass} h-auto py-2`}
          />
        </Field>
      </Section>

      <Section id="settings-contact" title="Coordonnées" description="Affichées sur la page Contact et utilisées par Google pour la fiche locale.">
        <Field id="setting-phone" label="Téléphone">
          {input("phone", { type: "tel", autoComplete: "off" })}
        </Field>
        <Field id="setting-email" label="E-mail public">
          {input("email", { type: "email" })}
        </Field>
        <Field id="setting-city" label="Ville ou adresse">
          {input("city")}
        </Field>
        <Field id="setting-hours" label="Horaires">
          {input("hours", { placeholder: "Lun – Ven : 9h – 18h" })}
        </Field>
      </Section>

      <Section id="settings-social" title="Réseaux sociaux" description="Un réseau laissé vide n'est pas affiché sur le site.">
        <Field id="setting-instagram" label="Instagram">
          {input("instagram", { type: "url", placeholder: "https://www.instagram.com/…" })}
        </Field>
        <Field id="setting-facebook" label="Facebook">
          {input("facebook", { type: "url", placeholder: "https://www.facebook.com/…" })}
        </Field>
        <Field id="setting-linkedin" label="LinkedIn" wide>
          {input("linkedin", { type: "url", placeholder: "https://www.linkedin.com/in/…" })}
        </Field>
      </Section>

      <Section
        id="settings-notifications"
        title="Notifications"
        description="L'adresse qui reçoit un e-mail à chaque nouvelle demande de contact."
      >
        <Field id="setting-notificationEmail" label="E-mail de notification" wide>
          {input("notificationEmail", { type: "email", required: true })}
        </Field>
      </Section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-gold/30 bg-white/95 p-3 shadow-lg shadow-plum/10 backdrop-blur">
        {notice && (
          <div className="mr-auto">
            <NotConnectedNotice>Les paramètres seront enregistrés une fois l&apos;administration reliée à la base de données.</NotConnectedNotice>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setValues(initial)
            setNotice(false)
          }}
          className="h-10 rounded-full px-4 text-sm font-medium text-plum outline-none hover:bg-blush focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Annuler les changements
        </button>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-plum outline-none hover:bg-gold/85 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Save aria-hidden="true" className="size-4" />
          Enregistrer
        </button>
      </div>
    </form>
  )
}

export { SettingsForm }
