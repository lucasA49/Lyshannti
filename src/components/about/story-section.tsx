import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { Container } from "@/components/layout/container"
import { SectionTitle } from "@/components/layout/section-title"

function StorySection() {
  return (
    <section aria-labelledby="story-title" className="py-14 sm:py-16">
      <Container>
        <SectionTitle id="story-title" title="Mon histoire" />
        <div className="mt-10 grid items-center gap-8 md:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-3xl border border-gold/30 shadow-md shadow-plum/10">
            <ImagePlaceholder
              label="Serviette roulée, lys rose, galets, flacons d'huile et bougie"
              className="aspect-video w-full"
            />
          </div>
          <p className="text-lg leading-relaxed text-plum/85">
            Lyshannti est née de la passion pour le soin, la beauté naturelle et
            le bien-être global. Mon objectif est de vous offrir un espace où
            écoute, expertise et douceur se rencontrent, pour des prestations
            qui vous ressemblent et répondent à vos besoins.
          </p>
        </div>
      </Container>
    </section>
  )
}

export { StorySection }
