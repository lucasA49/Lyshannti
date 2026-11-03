import { LotusIcon } from "@/components/brand/lotus-icon"
import { Container } from "@/components/layout/container"

// En-tête simple des pages intérieures : titre (h1) et description facultative.
function PageHero({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <section className="relative overflow-hidden border-b border-gold/30 bg-linear-to-br from-blush/70 via-background to-blush/50">
      <LotusIcon
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-6 hidden h-40 w-64 text-gold/25 md:block"
      />
      <Container className="relative py-14 text-center sm:py-20">
        <LotusIcon aria-hidden="true" className="mx-auto h-7 w-11 text-gold" />
        <h1 className="mt-4 font-heading text-4xl font-semibold text-plum italic sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-plum/80">
            {description}
          </p>
        )}
      </Container>
    </section>
  )
}

export { PageHero }
