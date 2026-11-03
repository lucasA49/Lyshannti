"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { cn } from "cn"

import { LotusIcon } from "@/components/brand/lotus-icon"
import { adminNav } from "@/lib/admin/nav"
import { siteConfig } from "@/config/site"

export type AdminBadges = { newContacts: number }

const itemClass =
  "group flex h-11 items-center gap-3 rounded-xl px-3 text-[0.95rem] outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/60"

// Contenu du menu latéral (utilisé sur desktop et dans le tiroir mobile).
// `collapsed` : icônes seules (desktop rétracté), libellés gardés pour les
// lecteurs d'écran et en info-bulle.
function AdminSidebar({
  badges,
  collapsed = false,
  onNavigate,
}: {
  badges: AdminBadges
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname().replace(/\/$/, "") || "/"

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/admin"
        onClick={onNavigate}
        className={cn(
          "flex h-16 shrink-0 items-center gap-2 border-b border-gold/20 outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
          collapsed ? "justify-center" : "px-5"
        )}
      >
        <LotusIcon className="h-6 w-9 shrink-0 text-gold" />
        <span className={cn("font-heading text-xl text-blush", collapsed && "sr-only")}>
          {siteConfig.name}
          <span className="block font-sans text-[0.65rem] tracking-[0.2em] text-gold uppercase">Administration</span>
        </span>
      </Link>

      <nav aria-label="Menu de l'administration" className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon
            const count = item.badge ? badges[item.badge] : 0
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)

            const content = (
              <>
                <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
                <span className={cn("flex-1 truncate", collapsed && "sr-only")}>{item.label}</span>
                {!item.available && !collapsed && (
                  <span className="rounded-full bg-blush/10 px-2 py-0.5 text-[0.65rem] tracking-wide text-blush/60 uppercase">
                    Bientôt
                  </span>
                )}
                {count > 0 && (
                  <span
                    className={cn(
                      "flex min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-xs font-semibold text-plum",
                      collapsed && "absolute top-1 right-1 min-w-4 text-[0.6rem]"
                    )}
                  >
                    {count}
                    <span className="sr-only"> nouvelle{count > 1 ? "s" : ""}</span>
                  </span>
                )}
              </>
            )

            return (
              <li key={item.href} className="relative">
                {item.available ? (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      itemClass,
                      collapsed && "justify-center px-0",
                      active ? "bg-gold text-plum" : "text-blush/85 hover:bg-blush/10 hover:text-blush"
                    )}
                  >
                    {content}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    title={`${item.label} (bientôt disponible)`}
                    className={cn(itemClass, "cursor-not-allowed text-blush/45", collapsed && "justify-center px-0")}
                  >
                    {content}
                    {collapsed && <span className="sr-only"> (bientôt disponible)</span>}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-gold/20 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? "Voir le site" : undefined}
          className={cn(itemClass, "text-blush/85 hover:bg-blush/10 hover:text-blush", collapsed && "justify-center px-0")}
        >
          <ExternalLink aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
          <span className={cn(collapsed && "sr-only")}>Voir le site</span>
          <span className="sr-only"> (nouvel onglet)</span>
        </a>
      </div>
    </div>
  )
}

export { AdminSidebar }
