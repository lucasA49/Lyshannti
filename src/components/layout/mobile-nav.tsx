"use client"

import { useRef } from "react"
import Link from "next/link"
import { CalendarDays, Menu, X } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button-variants"
import { LotusIcon } from "@/components/brand/lotus-icon"
import { NavLinks } from "@/components/layout/nav-links"
import { siteConfig } from "@/config/site"

// Menu mobile en <dialog> natif : piège du focus, touche Échap, fond inerte et
// retour du focus sur le bouton sont gérés par le navigateur, sans bibliothèque
// (le JavaScript des pages reste léger). Styles d'animation dans globals.css.
function MobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const open = () => dialogRef.current?.showModal()
  const close = () => dialogRef.current?.close()

  const iconButton = cn(
    buttonVariants({ variant: "ghost", size: "icon-lg" }),
    "text-blush hover:bg-blush/10 hover:text-blush"
  )

  return (
    <>
      <button
        type="button"
        aria-label="Ouvrir le menu"
        aria-haspopup="dialog"
        aria-controls="menu-mobile"
        onClick={open}
        className={cn(iconButton, "lg:hidden")}
      >
        <Menu className="size-6" />
      </button>

      <dialog
        id="menu-mobile"
        ref={dialogRef}
        aria-labelledby="menu-mobile-title"
        // Un clic sur le fond assombri (hors du panneau) ferme le menu.
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
        className="mobile-nav on-dark border-l border-gold/30 bg-plum text-blush"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-gold/20 p-4 pl-6">
            <LotusIcon className="h-6 w-9 text-gold" />
            <p id="menu-mobile-title" className="flex-1 font-heading text-xl text-blush">
              {siteConfig.name}
            </p>
            <button type="button" aria-label="Fermer le menu" onClick={close} className={iconButton}>
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label="Navigation mobile" className="p-6">
            <NavLinks className="flex flex-col gap-4" linkClassName="text-lg" onNavigate={close} />
          </nav>

          <div className="mt-auto p-6">
            <Link
              href={siteConfig.cta.href}
              onClick={close}
              className={cn(buttonVariants({ variant: "gold", size: "cta" }), "w-full")}
            >
              <CalendarDays />
              {siteConfig.cta.label}
            </Link>
          </div>
        </div>
      </dialog>
    </>
  )
}

export { MobileNav }
