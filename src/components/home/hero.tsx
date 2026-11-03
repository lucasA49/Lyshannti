import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { LotusIcon } from "@/components/brand/lotus-icon"
import { Container } from "@/components/layout/container"

const imageLabel = "Lys rose, bougie et huile de soin sur des serviettes"

function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-linear-to-br from-blush/70 via-background to-blush/50"
    >
      {/* Grande photo à droite sur desktop, bordée d'un arc doré. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[50%] overflow-hidden 2xl:w-[42%] border-l-[3px] border-gold [border-radius:50%_0_0_50%/100%_0_0_100%] lg:block"
      >
        <ImagePlaceholder label={imageLabel} className="size-full" />
      </div>

      <LotusIcon
        className="pointer-events-none absolute -bottom-6 -left-10 hidden h-40 w-64 text-gold/25 lg:block"
      />

      <Container className="relative grid gap-10 py-14 sm:py-20 lg:min-h-[30rem] lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="max-w-xl">
          <h1
            id="hero-title"
            className="font-heading text-4xl leading-[1.1] font-semibold text-plum italic sm:text-5xl xl:text-6xl"
          >
            L&apos;élégance{" "}
            <br />
            dans chaque détail
          </h1>
          <p className="mt-5 max-w-md text-lg text-plum/80">
            Des prestations uniques et personnalisées pour révéler votre beauté
            naturelle.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/prestations"
              className={cn(buttonVariants({ variant: "gold", size: "cta" }))}
            >
              Découvrir nos prestations
              <ArrowRight />
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "outline-plum", size: "cta" }))}
            >
              <Mail />
              Me contacter
            </Link>
          </div>
        </div>

        {/* Sur mobile et tablette, la photo passe sous le texte. */}
        <div className="overflow-hidden rounded-t-[10rem] rounded-b-3xl border-2 border-gold/80 lg:hidden">
          <ImagePlaceholder label={imageLabel} className="aspect-4/3 w-full sm:aspect-video" />
        </div>
      </Container>
    </section>
  )
}

export { Hero }
