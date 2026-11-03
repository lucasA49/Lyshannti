import { Gem, Heart, Sparkles } from "lucide-react"

import { LotusIcon } from "@/components/brand/lotus-icon"
import { Container } from "@/components/layout/container"
import { SectionTitle } from "@/components/layout/section-title"

const values = [
  {
    title: "Écoute",
    text: "Des besoins uniques et une attention sincère.",
    icon: <Heart strokeWidth={1.3} className="size-7" />,
  },
  {
    title: "Authenticité",
    text: "Une approche vraie et bienveillante.",
    icon: <LotusIcon strokeWidth={2} className="h-6 w-9" />,
  },
  {
    title: "Bienveillance",
    text: "Un espace de confiance et de détente.",
    icon: <Sparkles strokeWidth={1.3} className="size-7" />,
  },
  {
    title: "Expertise",
    text: "Des soins de qualité, adaptés à vos objectifs.",
    icon: <Gem strokeWidth={1.3} className="size-7" />,
  },
]

function ValuesSection() {
  return (
    <section aria-labelledby="values-title" className="pb-14 sm:pb-16">
      <Container>
        <div className="rounded-3xl border border-gold/30 bg-white/60 px-6 py-10 shadow-sm shadow-plum/5 sm:px-8">
          <SectionTitle id="values-title" title="Mes valeurs" />
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-gold/40">
            {values.map((value) => (
              <li key={value.title} className="flex items-start gap-3 lg:px-4">
                <span
                  aria-hidden="true"
                  className="flex size-14 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-linear-to-br from-white to-blush text-gold shadow-sm"
                >
                  {value.icon}
                </span>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-plum">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-sm text-plum/75">{value.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

export { ValuesSection }
