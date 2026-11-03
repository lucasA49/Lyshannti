import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactInfo } from "@/components/contact/contact-info";
import { StaticMap } from "@/components/contact/static-map";
import { LotusIcon } from "@/components/brand/lotus-icon";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question, un besoin ou une demande de rendez-vous ? Contactez Lyshannti par téléphone, par email ou via le formulaire.",
};

export default function ContactPage() {
  return (
    <main id="contenu" className="flex-1">
      <ContactHero />

      <section
        aria-label="Coordonnées et formulaire de contact"
        className="relative overflow-hidden bg-linear-to-b from-blush/40 to-blush/60"
      >
        <LotusIcon
          aria-hidden="true"
          strokeWidth={1}
          className="pointer-events-none absolute bottom-24 -left-20 hidden h-44 w-64 rotate-45 text-gold/40 lg:block"
        />
        <Container className="relative grid gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-10">
          {/* Mobile : coordonnées, formulaire puis carte (ordre via `order`).
              Desktop : coordonnées et carte empilées à gauche, formulaire à droite. */}
          <div className="contents lg:flex lg:flex-col lg:gap-6">
            <ContactInfo />
            <StaticMap className="order-last lg:order-none" />
          </div>
          <ContactForm />
        </Container>
      </section>
    </main>
  );
}
