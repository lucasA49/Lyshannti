import { Heart, Sparkles } from "lucide-react"

import { Container } from "@/components/layout/container"
import { soinsQuote } from "@/content/soins"

function SessionQuote() {
  return (
    <section aria-label="Chaque séance" className="pb-14 sm:pb-16">
      <Container>
        <figure className="mx-auto max-w-3xl rounded-[3rem] bg-linear-to-r from-blush/30 via-blush to-blush/30 px-6 py-10 text-center sm:px-12">
          <Heart aria-hidden="true" className="mx-auto size-6 fill-gold text-gold" />
          <blockquote className="mt-4 font-heading text-2xl leading-snug text-plum italic sm:text-3xl">
            <p>{soinsQuote.text}</p>
          </blockquote>
          <Sparkles aria-hidden="true" className="mx-auto mt-4 size-5 text-gold" />
          <figcaption className="mt-4 text-sm font-medium tracking-[0.25em] text-plum/80 uppercase">
            {soinsQuote.signature}
          </figcaption>
        </figure>
      </Container>
    </section>
  )
}

export { SessionQuote }
