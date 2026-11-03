import { ChevronDown, UserRound } from "lucide-react"

import { LogoutButton } from "@/components/admin/shell/logout-button"

// Menu du compte en Popover natif (attribut `popover`) : ouverture, fermeture
// à l'Échap ou au clic à l'extérieur gérées par le navigateur, sans JavaScript.
function AccountMenu({ name, email }: { name: string; email: string }) {
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <button
        type="button"
        popoverTarget="account-menu"
        className="flex items-center gap-2 rounded-full p-1 pr-2 text-plum outline-none transition-colors hover:bg-blush focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full bg-plum font-heading text-lg text-gold">
          {initial}
        </span>
        <span className="hidden text-sm font-medium sm:inline">{name}</span>
        <ChevronDown aria-hidden="true" className="size-4" />
        <span className="sr-only">Menu du compte</span>
      </button>

      <div
        id="account-menu"
        popover="auto"
        // Positionné sous l'en-tête (hauteur fixe), à droite : fiable sur tous les navigateurs.
        className="m-0 w-64 rounded-2xl border border-gold/30 bg-white p-2 text-plum shadow-xl shadow-plum/15 [inset:auto] top-18 right-4"
      >
        <div className="border-b border-plum/10 px-3 pt-2 pb-3">
          <p className="font-medium">{name}</p>
          <p className="truncate text-sm text-plum/70">{email}</p>
        </div>
        <ul className="pt-2">
          <li>
            <span
              aria-disabled="true"
              className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-plum/50"
            >
              <UserRound aria-hidden="true" className="size-4" />
              Mon profil et mot de passe
              <span className="ml-auto text-[0.65rem] uppercase">Bientôt</span>
            </span>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>
    </div>
  )
}

export { AccountMenu }
