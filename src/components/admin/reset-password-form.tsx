"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Circle, ShieldCheck } from "lucide-react"
import { cn } from "cn"

import {
  NotConnectedNotice,
  PasswordInput,
  authLinkClass,
  authSubmitClass,
} from "@/components/admin/auth-fields"
import {
  PASSWORD_MIN_LENGTH,
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth"

function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={cn("flex items-center gap-2", ok ? "text-plum" : "text-plum/70")}>
      {ok ? (
        <Check aria-hidden="true" strokeWidth={3} className="size-4 text-plum" />
      ) : (
        <Circle aria-hidden="true" className="size-4" />
      )}
      {children}
      <span className="sr-only">{ok ? " : respecté" : " : non respecté"}</span>
    </li>
  )
}

function ResetPasswordForm() {
  // Jeton du lien reçu par e-mail. Le serveur vérifiera qu'il existe, n'a pas
  // expiré et n'a pas déjà servi.
  const token = useSearchParams().get("token")
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: { password: "", confirm: "" },
  })

  // useWatch (et non watch) : compatible avec le React Compiler.
  const [password, confirm] = useWatch({ control, name: ["password", "confirm"] })

  if (!token) {
    return (
      <div className="space-y-5 text-center">
        <p className="text-plum">
          Ce lien de réinitialisation est invalide ou incomplet. Les liens sont valables 30 minutes
          et ne servent qu&apos;une fois.
        </p>
        <Link href="/admin/mot-de-passe-oublie" className={authLinkClass}>
          Demander un nouveau lien
        </Link>
      </div>
    )
  }

  // TODO backend : vérifier le jeton, hacher le nouveau mot de passe (bcrypt),
  // invalider le jeton et fermer toutes les sessions ouvertes du compte.
  const onSubmit = () => setSubmitted(true)

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <PasswordInput
        id="reset-password"
        label="Nouveau mot de passe"
        autoComplete="new-password"
        error={errors.password?.message}
        describedBy="reset-rules"
        {...register("password")}
      />
      <PasswordInput
        id="reset-confirm"
        label="Confirmer le mot de passe"
        autoComplete="new-password"
        error={errors.confirm?.message}
        {...register("confirm")}
      />

      <ul id="reset-rules" className="space-y-1.5 text-sm">
        <Rule ok={password.length >= PASSWORD_MIN_LENGTH}>
          Au moins {PASSWORD_MIN_LENGTH} caractères
        </Rule>
        <Rule ok={password.length > 0 && password === confirm}>Les deux saisies sont identiques</Rule>
      </ul>
      <p className="text-sm text-plum/75">
        Astuce&nbsp;: une phrase de plusieurs mots est à la fois facile à retenir et très sûre.
      </p>

      <button type="submit" disabled={isSubmitting} className={authSubmitClass}>
        Enregistrer
        <ShieldCheck />
      </button>

      {submitted && (
        <NotConnectedNotice>
          L&apos;enregistrement n&apos;est pas encore activé : il sera branché avec le backend.
        </NotConnectedNotice>
      )}

      <p className="text-center">
        <Link href="/admin/connexion" className={authLinkClass}>
          Retour à la connexion
        </Link>
      </p>
    </form>
  )
}

export { ResetPasswordForm }
