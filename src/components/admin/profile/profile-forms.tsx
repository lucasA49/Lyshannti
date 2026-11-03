"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { cn } from "cn"

import type { ActionResult } from "@/lib/admin/actions/articles"
import { changePassword, signOutEverywhere, updateProfile } from "@/lib/admin/actions/profile"
import { PASSWORD_MIN_LENGTH } from "@/lib/validations/auth"

const fieldClass =
  "h-10 w-full rounded-xl border border-plum/20 bg-[#faf3f1] px-3 text-sm text-plum outline-none focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/40"
const buttonClass =
  "inline-flex h-10 items-center rounded-full bg-gold px-5 text-sm font-semibold text-plum outline-none hover:bg-gold/85 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"

function Card({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-3xl border border-gold/25 bg-white p-5 shadow-sm shadow-plum/5 sm:p-6">
      <h2 id={id} className="flex items-center gap-3 font-heading text-xl font-semibold text-plum">
        <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-gold" />
        {title}
      </h2>
      <p className="mt-1 text-sm text-plum/70">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Message({ result }: { result: ActionResult | null }) {
  if (!result) return null
  return (
    <p role="status" className={cn("mt-4 rounded-xl px-4 py-3 text-sm text-plum", result.ok ? "bg-gold/20" : "border border-destructive/30 bg-destructive/5")}>
      {result.message}
    </p>
  )
}

function Field({ id, label, ...props }: { id: string; label: string } & React.ComponentProps<"input">) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-plum">
        {label}
      </label>
      <input id={id} className={fieldClass} {...props} />
    </div>
  )
}

function ProfileForms({ name, email }: { name: string; email: string }) {
  const router = useRouter()
  // Session fermée côté serveur : on renvoie vers la connexion.
  const goToLogin = () => setTimeout(() => router.push("/admin/connexion"), 1800)
  const [profile, setProfile] = useState({ name, email })
  const [passwords, setPasswords] = useState({ current: "", password: "", confirm: "" })
  const [profileResult, setProfileResult] = useState<ActionResult | null>(null)
  const [passwordResult, setPasswordResult] = useState<ActionResult | null>(null)
  const [sessionResult, setSessionResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()

  return (
    <div className="space-y-6">
      <Card id="profile-identity" title="Mon compte" description="Votre nom (affiché dans l'admin) et l'e-mail utilisé pour vous connecter.">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            startTransition(async () => setProfileResult(await updateProfile(profile)))
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Field id="profile-name" label="Nom" value={profile.name} required onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <Field id="profile-email" label="E-mail de connexion" type="email" autoComplete="username" value={profile.email} required onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          <div className="sm:col-span-2">
            <button type="submit" disabled={pending} className={buttonClass}>
              Enregistrer
            </button>
            <Message result={profileResult} />
          </div>
        </form>
      </Card>

      <Card id="profile-password" title="Mot de passe" description={`Au moins ${PASSWORD_MIN_LENGTH} caractères. Après le changement, toutes vos sessions sont fermées.`}>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            startTransition(async () => {
              const response = await changePassword(passwords)
              setPasswordResult(response)
              if (response.ok) goToLogin()
            })
          }}
          className="grid gap-4 sm:grid-cols-3"
        >
          <Field id="profile-current" label="Mot de passe actuel" type="password" autoComplete="current-password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
          <Field id="profile-new" label="Nouveau mot de passe" type="password" autoComplete="new-password" value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} />
          <Field id="profile-confirm" label="Confirmation" type="password" autoComplete="new-password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
          <div className="sm:col-span-3">
            <button type="submit" disabled={pending} className={buttonClass}>
              Changer le mot de passe
            </button>
            <Message result={passwordResult} />
          </div>
        </form>
      </Card>

      <Card id="profile-sessions" title="Sécurité" description="Un doute (ordinateur partagé, téléphone perdu) ? Fermez toutes les sessions ouvertes.">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const response = await signOutEverywhere()
              setSessionResult(response)
              if (response.ok) goToLogin()
            })
          }
          className="inline-flex h-10 items-center rounded-full border border-plum/25 px-5 text-sm font-medium text-plum outline-none hover:border-plum focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Se déconnecter de tous les appareils
        </button>
        <Message result={sessionResult} />
      </Card>
    </div>
  )
}

export { ProfileForms }
