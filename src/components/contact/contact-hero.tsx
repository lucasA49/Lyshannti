import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { LotusIcon } from "@/components/brand/lotus-icon"
import { Container } from "@/components/layout/container"

const imageLabel = "Lys rose, bougie, galets et flacon d'huile sur une serviette"

function ContactHero() {
  return (
    <section
      aria-labelledby="contact-title"
      className="relative overflow-hidden border-b border-gold/30 bg-linear-to-br from-blush/70 via-background to-blush/50"
    >
      {/* Photo à droite sur desktop, bordée d'un arc doré (comme l'accueil). */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[52%] overflow-hidden border-l-[3px] border-gold [border-radius:50%_0_0_50%/100%_0_0_100%] lg:block 2xl:w-[44%]"
      >
        <ImagePlaceholder label={imageLabel} className="size-full" />
      </div>

      <LotusIcon
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -left-10 hidden h-40 w-64 text-gold/25 lg:block"
      />

      <Container className="relative grid gap-10 py-12 sm:py-16 lg:min-h-[24rem] lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="max-w-lg">
          <p className="text-sm font-semibold tracking-[0.2em] text-plum/80 uppercase">
            Contact
          </p>
          <h1
            id="contact-title"
            className="mt-2 font-heading text-4xl leading-tight font-semibold text-plum italic sm:text-5xl xl:text-6xl"
          >
            Contactez-nous
          </h1>
          <div aria-hidden="true" className="mt-5 flex items-center gap-4">
            <span className="h-0.5 w-20 rounded-full bg-gold" />
            <span className="h-px w-32 bg-linear-to-r from-transparent via-plum/30 to-transparent" />
          </div>
          <p className="mt-5 text-lg text-plum/80">
            Une question, un besoin ou une demande de rendez-vous&nbsp;? Nous
            sommes à votre écoute et ravies d&apos;échanger avec vous.
          </p>
        </div>

        {/* Sur mobile et tablette, la photo passe sous le texte. */}
        <div className="overflow-hidden rounded-t-[10rem] rounded-b-3xl border-2 border-gold/80 lg:hidden">
          <ImagePlaceholder label={imageLabel} className="aspect-4/3 w-full sm:aspect-video" />
        </div>
      </Container>
    </section>
  )
}

export { ContactHero }
