import Link from "next/link"
import { cn } from "cn"

import { LotusIcon } from "@/components/brand/lotus-icon"
import { siteConfig } from "@/config/site"

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}, retour à l'accueil`}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
        className
      )}
    >
      <LotusIcon className="h-7 w-11 text-gold lg:h-8 lg:w-12" />
      <span className="font-heading text-2xl text-blush lg:text-[1.7rem]">
        {siteConfig.name}
      </span>
    </Link>
  )
}

export { Logo }
