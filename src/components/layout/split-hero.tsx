import Image, { type StaticImageData } from "next/image"
import { cn } from "cn"

import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { LotusIcon } from "@/components/brand/lotus-icon"
import { Container } from "@/components/layout/container"

// En-tête des pages intérieures avec photo : surtitre, titre (h1), description,
// et photo à droite bordée d'un arc doré (sous le texte sur mobile et tablette).
// Sans `image`, un cadre provisoire décrit la photo attendue (`imageLabel`).
function SplitHero({
  id,
  eyebrow,
  title,
  description,
  image,
  imageLabel,
  titleClassName,
}: {
  id: string
  eyebrow: string
  title: React.ReactNode
  description: string
  image?: StaticImageData
  imageLabel: string
  /** Pour ajuster la taille d'un titre long. */
  titleClassName?: string
}) {
  return (
    <section
      aria-labelledby={id}
      className="relative overflow-hidden border-b border-gold/30 bg-linear-to-br from-blush/70 via-background to-blush/50"
    >
      <LotusIcon
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -left-10 hidden h-40 w-64 text-gold/25 lg:block"
      />

      {/* Sur desktop, le Container n'est plus `relative` : la photo se place
          alors contre le bord droit de la section. */}
      <Container className="relative grid gap-10 py-12 sm:py-16 lg:static lg:min-h-[30rem] xl:min-h-[32rem] lg:grid-cols-2 lg:items-center lg:py-20">
        {/* Sur desktop, le texte s'arrête avant la photo (largeur = début de la
            photo - marge gauche du Container - espace de respiration). */}
        <div className="relative max-w-xl lg:max-w-[calc(44vw_-_3.5rem)] xl:max-w-[calc(43vw_-_max(0rem,_50vw_-_36rem)_-_3.5rem)] 2xl:max-w-[calc(49vw_-_max(0rem,_50vw_-_36rem)_-_3.5rem)]">
          <p className="text-sm font-semibold tracking-[0.2em] text-plum/80 uppercase">
            {eyebrow}
          </p>
          <h1
            id={id}
            className={cn(
              "mt-2 font-heading text-4xl leading-tight font-semibold text-plum italic sm:text-5xl lg:text-[2.75rem] xl:text-[2.85rem] 2xl:text-[3.25rem]",
              titleClassName
            )}
          >
            {title}
          </h1>
          <div aria-hidden="true" className="mt-5 flex items-center gap-4">
            <span className="h-0.5 w-20 rounded-full bg-gold" />
            <span className="h-px w-32 bg-linear-to-r from-transparent via-plum/30 to-transparent" />
          </div>
          <p className="mt-5 text-lg text-plum/80">{description}</p>
        </div>

        {/* Une seule photo : carte arrondie sous le texte sur mobile et tablette ;
            sur desktop, collée à droite et ouverte par un arc doré qui descend
            en douceur du haut vers le bas (comme la maquette). */}
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl border-2 border-gold/70 shadow-lg shadow-plum/15 sm:aspect-video lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[56%] xl:w-[57%] lg:rounded-none lg:rounded-tl-[22%_100%] lg:border-0 lg:border-l-[3px] lg:border-gold lg:shadow-none 2xl:w-[51%]">
          {image ? (
            <Image
              src={image}
              alt={imageLabel}
              fill
              sizes="(min-width: 1024px) 57vw, 100vw"
              placeholder="blur"
              loading="eager"
              fetchPriority="high"
              className="object-cover object-[55%_center] lg:object-[60%_top]"
            />
          ) : (
            <ImagePlaceholder label={imageLabel} className="size-full" />
          )}
        </div>
      </Container>
    </section>
  )
}

export { SplitHero }
