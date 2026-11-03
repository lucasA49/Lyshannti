import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button-variants"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { LotusIcon } from "@/components/brand/lotus-icon"
import { Container } from "@/components/layout/container"
import { siteConfig } from "@/config/site"

function ApproachSection() {
  return (
    <section
      aria-labelledby="approach-title"
      className="on-dark relative overflow-hidden bg-linear-to-br from-plum via-plum to-[color-mix(in_oklch,#211325_80%,#eed8d4)] text-blush"
    >
      <LotusIcon
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute -right-10 -bottom-8 hidden h-56 w-80 text-gold/35 lg:block"
      />

      <Container className="relative grid items-center gap-10 py-16 sm:py-20 md:grid-cols-[2fr_3fr] lg:gap-16">
        {/* Image ovale doublée d'un second anneau doré, comme sur la maquette. */}
        <div className="relative mx-auto w-full max-w-xs md:max-w-none">
          <span
            aria-hidden="true"
            className="absolute -inset-3 rounded-[50%] border border-gold/60"
          />
          <div className="overflow-hidden rounded-[50%] border-2 border-gold">
            <ImagePlaceholder
              label="Bougie, serviette roulée, huile et orchidée rose"
              className="aspect-5/4"
            />
          </div>
        </div>

        <div className="max-w-xl text-center md:text-left">
          <p className="text-sm font-semibold tracking-[0.2em] text-gold uppercase">
            Pourquoi choisir {siteConfig.name} ?
          </p>
          <h2
            id="approach-title"
            className="mt-3 font-heading text-3xl text-blush sm:text-4xl"
          >
            Une approche globale du bien-être
          </h2>
          <p className="mt-5 text-blush/85">
            Écoute, expertise et personnalisation sont au cœur de chaque
            accompagnement, pour vous offrir une expérience unique, alliant
            beauté, détente et confiance en soi.
          </p>
          <Link
            href="/a-propos"
            className={cn(
              buttonVariants({ variant: "gold", size: "cta" }),
              "mt-8"
            )}
          >
            Découvrir mon approche
            <ArrowRight />
          </Link>
        </div>
      </Container>
    </section>
  )
}

export { ApproachSection }
