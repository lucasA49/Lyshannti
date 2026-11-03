import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button-variants"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { Container } from "@/components/layout/container"

function QuoteBanner() {
  return (
    <section aria-label="Notre promesse" className="pb-16 sm:pb-20">
      <Container>
        <div className="on-dark grid overflow-hidden rounded-3xl bg-linear-to-br from-plum to-[color-mix(in_oklch,#211325_85%,#eed8d4)] text-blush shadow-lg shadow-plum/20 md:grid-cols-[2fr_3fr]">
          <ImagePlaceholder
            label="Lys rose, serviette roulée et bougie dorée"
            className="aspect-video md:aspect-auto md:min-h-64"
          />

          <div className="flex flex-col items-center justify-center gap-8 px-6 py-12 text-center sm:px-10 md:flex-row md:gap-12 md:text-left">
            <span aria-hidden="true" className="hidden h-28 w-px shrink-0 bg-gold/70 md:block" />
            <div className="flex flex-col items-center gap-8">
              <figure>
                <blockquote className="relative font-heading text-2xl leading-snug text-blush italic sm:text-3xl">
                  <span aria-hidden="true" className="absolute -top-5 -left-3 font-heading text-6xl leading-none text-gold not-italic sm:-left-7">
                    &ldquo;
                  </span>
                  <p>
                    Vous offrir bien plus qu&apos;un service&nbsp;: une
                    véritable expérience de bien-être.
                  </p>
                  <span aria-hidden="true" className="absolute -right-2 -bottom-8 font-heading text-6xl leading-none text-gold not-italic sm:-right-6">
                    &rdquo;
                  </span>
                </blockquote>
              </figure>
              <Link
                href="/prestations"
                className={cn(buttonVariants({ variant: "gold", size: "cta" }))}
              >
                Découvrir nos prestations
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export { QuoteBanner }
