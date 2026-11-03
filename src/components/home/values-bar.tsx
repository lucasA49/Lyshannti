import { Gem, Heart, Leaf } from "lucide-react"

import { LotusIcon } from "@/components/brand/lotus-icon"
import { Container } from "@/components/layout/container"

const values = [
  {
    title: "Qualité",
    text: "Des produits de haute qualité",
    icon: <Gem strokeWidth={1.3} className="size-7" />,
  },
  {
    title: "Bien-être",
    text: "Une approche douce et personnalisée",
    icon: <LotusIcon strokeWidth={2} className="h-6 w-9" />,
  },
  {
    title: "Écoute",
    text: "Vos besoins au cœur de notre attention",
    icon: <Heart strokeWidth={1.3} className="size-7" />,
  },
  {
    title: "Résultats",
    text: "Une beauté qui vous ressemble",
    icon: <Leaf strokeWidth={1.3} className="size-7" />,
  },
]

function ValuesBar() {
  return (
    <section aria-label="Nos valeurs" className="border-y border-gold/30 bg-blush/45">
      <Container>
        <ul className="grid grid-cols-1 gap-y-6 py-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-gold/40">
          {values.map((value) => (
            <li
              key={value.title}
              className="flex items-center gap-4 lg:justify-center lg:px-6"
            >
              <span
                aria-hidden="true"
                className="flex size-14 shrink-0 items-center justify-center rounded-full border border-gold bg-background text-gold"
              >
                {value.icon}
              </span>
              <div>
                <p className="font-heading text-lg font-semibold text-plum">
                  {value.title}
                </p>
                <p className="text-sm text-plum/70">{value.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export { ValuesBar }
