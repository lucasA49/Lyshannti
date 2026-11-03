import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { Container } from "@/components/layout/container"
import { MobileNav } from "@/components/layout/mobile-nav"
import { NavLinks } from "@/components/layout/nav-links"
import { siteConfig } from "@/config/site"

function Header() {
  return (
    <header className="on-dark sticky top-0 z-40 border-b border-gold/30 bg-plum shadow-md shadow-plum/20">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-20">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <NavLinks className="flex items-center gap-10 text-[0.95rem]" />
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={siteConfig.cta.href}
            className={cn(
              buttonVariants({ variant: "gold", size: "cta" }),
              "hidden sm:inline-flex"
            )}
          >
            <CalendarDays />
            {siteConfig.cta.label}
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}

export { Header }
