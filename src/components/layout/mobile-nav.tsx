"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarDays, Menu } from "lucide-react"
import { cn } from "cn"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LotusIcon } from "@/components/brand/lotus-icon"
import { NavLinks } from "@/components/layout/nav-links"
import { siteConfig } from "@/config/site"

function MobileNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Ouvrir le menu"
            className="text-blush hover:bg-blush/10 hover:text-blush lg:hidden"
          />
        }
      >
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="on-dark border-gold/30 bg-plum text-blush [&_[data-slot=sheet-close]]:text-blush [&_[data-slot=sheet-close]]:hover:bg-blush/10 [&_[data-slot=sheet-close]]:hover:text-blush"
      >
        <SheetHeader className="flex-row items-center gap-2 border-b border-gold/20 pb-4">
          <LotusIcon className="h-6 w-9 text-gold" />
          <SheetTitle className="font-heading text-xl text-blush">
            {siteConfig.name}
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Navigation mobile" className="px-6">
          <NavLinks
            className="flex flex-col gap-4"
            linkClassName="text-lg"
            onNavigate={close}
          />
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
      </SheetContent>
    </Sheet>
  )
}

export { MobileNav }
