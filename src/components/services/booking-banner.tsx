import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button-variants"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { LotusIcon } from "@/components/brand/lotus-icon"
import { Container } from "@/components/layout/container"
import { siteConfig } from "@/config/site"

function BookingBanner() {
  return (
    <section
      id="sur-mesure"
      aria-labelledby="sur-mesure-title"
      className="scroll-mt-28 pb-16 sm:pb-20"
    >
      <Container>
        <div className="on-dark grid overflow-hidden rounded-3xl bg-linear-to-r from-plum to-[color-mix(in_oklch,#211325_85%,#eed8d4)] text-blush shadow-lg shadow-plum/20 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2fr_auto]">
          <ImagePlaceholder
            label="Lys roses en fleurs"
            className="aspect-video md:aspect-auto md:min-h-56"
          />

          <div className="px-6 py-10 text-center sm:px-10">
            <h2
              id="sur-mesure-title"
              className="font-heading text-2xl font-semibold text-blush sm:text-3xl"
            >
              Envie d&apos;un soin adapté à vos besoins&nbsp;?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blush/85">
              Contactez-nous pour un accompagnement personnalisé et réservez
              votre séance dès maintenant.
            </p>
            <Link
              href={siteConfig.cta.href}
              className={cn(buttonVariants({ variant: "gold", size: "cta" }), "mt-6")}
            >
              <CalendarDays />
              {siteConfig.cta.label}
            </Link>
          </div>

          {/* Lotus décoratif à droite, séparé par un trait doré (desktop). */}
          <div aria-hidden="true" className="hidden items-center gap-10 pr-12 lg:flex">
            <span className="h-28 w-px bg-gold/60" />
            <LotusIcon strokeWidth={1.2} className="h-28 w-44 text-gold" />
          </div>
        </div>
      </Container>
    </section>
  )
}

export { BookingBanner }
