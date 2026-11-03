import { LotusIcon } from "@/components/brand/lotus-icon"
import { Container } from "@/components/layout/container"
import { SectionTitle } from "@/components/layout/section-title"
import { ServiceCard } from "@/components/home/service-card"
import { services } from "@/content/services"

function ServicesSection() {
  return (
    <section
      aria-labelledby="services-title"
      className="relative overflow-hidden py-16 sm:py-20"
    >
      <LotusIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-10 -right-16 hidden h-48 w-72 rotate-12 text-gold/20 lg:block"
      />

      <Container className="relative">
        <SectionTitle id="services-title" title="Nos prestations" />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {services.map((service) => (
            <li
              key={service.slug}
              className="flex sm:last:col-span-2 sm:last:mx-auto sm:last:max-w-[calc(50%-0.75rem)] lg:last:col-span-1 lg:last:max-w-none"
            >
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export { ServicesSection }
