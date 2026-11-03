import Link from "next/link"
import { Mail } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { LotusIcon } from "@/components/brand/lotus-icon"
import { Container } from "@/components/layout/container"

function ContactCta() {
  return (
    <section
      aria-labelledby="contact-cta-title"
      className="on-dark relative overflow-hidden bg-linear-to-r from-[color-mix(in_oklch,#211325_80%,#eed8d4)] via-plum to-[color-mix(in_oklch,#211325_80%,#eed8d4)] text-blush"
    >
      <LotusIcon
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute -bottom-6 -left-12 hidden h-44 w-64 -rotate-12 text-blush/25 lg:block"
      />
      <LotusIcon
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute top-6 -right-8 hidden h-44 w-64 text-gold/35 lg:block"
      />

      <Container className="relative py-16 text-center sm:py-20">
        <h2
          id="contact-cta-title"
          className="mx-auto max-w-2xl font-heading text-3xl text-blush sm:text-4xl"
        >
          Une question, un projet, envie d&apos;un accompagnement&nbsp;?
        </h2>
        <p className="mt-4 text-blush/85">
          Je suis à votre écoute pour échanger sur vos besoins.
        </p>
        <Link
          href="/contact"
          className={cn(buttonVariants({ variant: "gold", size: "cta" }), "mt-8")}
        >
          <Mail />
          Me contacter
        </Link>
      </Container>
    </section>
  )
}

export { ContactCta }
