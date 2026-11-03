import {
  SoinBranchIcon,
  SoinCrystalIcon,
  SoinHeartIcon,
  SoinLotusIcon,
  SoinMoonIcon,
  SoinSpiralIcon,
} from "@/components/brand/soin-icons"
import { Container } from "@/components/layout/container"
import { SectionTitle } from "@/components/layout/section-title"
import { soinsBenefits, type SoinBenefit } from "@/content/soins"

const iconClass = "size-10 sm:size-14"

const icons: Record<SoinBenefit["icon"], React.ReactNode> = {
  lotus: <SoinLotusIcon className={iconClass} />,
  moon: <SoinMoonIcon className={iconClass} />,
  crystal: <SoinCrystalIcon className={iconClass} />,
  spiral: <SoinSpiralIcon className={iconClass} />,
  heart: <SoinHeartIcon className={iconClass} />,
  sprout: <SoinBranchIcon className={iconClass} />,
}

function BenefitsSection() {
  return (
    <section aria-labelledby="benefits-title" className="py-14 sm:py-16">
      <Container>
        <SectionTitle id="benefits-title" title="Mes soins vous aident à" />
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-6 xl:gap-0 xl:divide-x xl:divide-gold/40">
          {soinsBenefits.map((benefit) => (
            <li
              key={benefit.text}
              className="flex items-center gap-4 rounded-3xl border border-gold/25 bg-white/60 px-5 py-4 sm:flex-col sm:py-7 sm:text-center shadow-sm shadow-plum/5 xl:rounded-none xl:border-0 xl:bg-transparent xl:py-2 xl:shadow-none"
            >
              <span
                aria-hidden="true"
                className="flex size-14 shrink-0 items-center sm:size-20 justify-center rounded-full border border-gold/60 bg-linear-to-br from-blush to-gold/40 text-plum shadow-sm ring-4 ring-white/60"
              >
                {icons[benefit.icon]}
              </span>
              <p className="max-w-56 text-plum">{benefit.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export { BenefitsSection }
