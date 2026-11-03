// Prestations mises en avant sur l'accueil.
// `imageAlt` décrit la photo attendue, en attendant les vraies images.
export type Service = {
  slug: string
  title: string
  excerpt: string
  imageAlt: string
}

export const services: Service[] = [
  {
    slug: "soin-du-visage",
    title: "Soin du visage",
    excerpt: "Un soin sur-mesure pour une peau éclatante et revitalisée.",
    imageAlt: "Femme détendue avec un masque de soin sur le visage",
  },
  {
    slug: "soin-du-corps",
    title: "Soin du corps",
    excerpt:
      "Une parenthèse de détente pour relâcher les tensions et se ressourcer.",
    imageAlt: "Massage relaxant du dos",
  },
  {
    slug: "accompagnement-personnalise",
    title: "Accompagnement personnalisé",
    excerpt: "Un suivi adapté à vos besoins et à vos objectifs.",
    imageAlt: "Bougie, serviettes et lys roses",
  },
]
