"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

// Déconnexion : supprime le cookie de session puis renvoie à la connexion.
function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/connexion/" })}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none hover:bg-blush focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <LogOut aria-hidden="true" className="size-4" />
      Se déconnecter
    </button>
  )
}

export { LogoutButton }
