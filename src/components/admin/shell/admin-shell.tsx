"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Info, Menu, PanelLeftClose, PanelLeftOpen, Plus, X } from "lucide-react"
import { cn } from "cn"

import { AccountMenu } from "@/components/admin/shell/account-menu"
import { AdminSidebar, type AdminBadges } from "@/components/admin/shell/admin-sidebar"

// Cadre de toutes les pages de l'admin : menu latéral (rétractable sur
// desktop, tiroir <dialog> natif sur mobile), en-tête et zone de contenu.
function AdminShell({
  admin,
  badges,
  isDemo,
  children,
}: {
  admin: { name: string; email: string }
  badges: AdminBadges
  isDemo: boolean
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const drawerRef = useRef<HTMLDialogElement>(null)
  const closeDrawer = () => drawerRef.current?.close()

  return (
    <div className="min-h-dvh bg-[#faf3f1] text-plum lining-nums">
      {/* Menu latéral desktop */}
      <aside
        className={cn(
          "on-dark fixed inset-y-0 left-0 z-30 hidden bg-plum transition-[width] duration-200 lg:block",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <AdminSidebar badges={badges} collapsed={collapsed} />
      </aside>

      {/* Tiroir mobile */}
      <dialog
        ref={drawerRef}
        aria-label="Menu de l'administration"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDrawer()
        }}
        className="admin-drawer on-dark bg-plum"
      >
        <div className="relative h-full">
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Fermer le menu"
            className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-xl text-blush outline-none hover:bg-blush/10 focus-visible:ring-3 focus-visible:ring-ring/60"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <AdminSidebar badges={badges} onNavigate={closeDrawer} />
        </div>
      </dialog>

      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-20" : "lg:pl-72")}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gold/25 bg-white/85 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => drawerRef.current?.showModal()}
            aria-label="Ouvrir le menu"
            aria-haspopup="dialog"
            className="flex size-10 items-center justify-center rounded-xl outline-none hover:bg-blush focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
            aria-pressed={collapsed}
            className="hidden size-10 items-center justify-center rounded-xl outline-none hover:bg-blush focus-visible:ring-3 focus-visible:ring-ring/50 lg:flex"
          >
            {collapsed ? <PanelLeftOpen className="size-5" aria-hidden="true" /> : <PanelLeftClose className="size-5" aria-hidden="true" />}
          </button>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/articles/nouveau"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-gold px-3 text-sm font-semibold text-plum shadow-sm outline-none hover:bg-gold/85 focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-4"
            >
              <Plus className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Nouvel article</span>
              <span className="sr-only sm:hidden">Nouvel article</span>
            </Link>
            <AccountMenu name={admin.name} email={admin.email} />
          </div>
        </header>

        {isDemo && (
          <p role="note" className="flex items-center gap-2 border-b border-gold/30 bg-gold/20 px-4 py-2 text-sm text-plum sm:px-6">
            <Info aria-hidden="true" className="size-4 shrink-0" />
            Données de démonstration : l&apos;administration n&apos;est pas encore reliée à la base de données.
          </p>
        )}

        <main id="contenu" className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export { AdminShell }
