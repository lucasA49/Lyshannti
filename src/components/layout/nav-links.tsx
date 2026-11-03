"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

import { siteConfig } from "@/config/site"

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

function NavLinks({
  className,
  linkClassName,
  onNavigate,
}: {
  className?: string
  linkClassName?: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <ul className={className}>
      {siteConfig.nav.map((item) => {
        const active = isActive(pathname, item.href)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "relative inline-block rounded-sm py-1 text-blush/85 outline-none transition-colors hover:text-blush focus-visible:ring-3 focus-visible:ring-ring/60",
                "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-gold after:transition-transform hover:after:scale-x-100",
                active && "text-blush after:scale-x-100",
                linkClassName
              )}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export { NavLinks }
