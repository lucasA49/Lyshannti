import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

import { SplitHero } from "@/components/layout/split-hero";
import { BenefitsSection } from "@/components/services/benefits-section";
import { BookingBanner } from "@/components/services/booking-banner";
import { SessionQuote } from "@/components/services/session-quote";
import { soinsIntro } from "@/content/soins";

export const metadata: Metadata = pageMetadata({
  title: "Mes soins énergétiques",
  description:
    "Soins énergétiques et médiumniques pour libérer ce qui vous alourdit, rééquilibrer vos énergies et vous reconnecter à votre essence.",
  path: "/prestations",
});

export default function PrestationsPage() {
  return (
    <main id="contenu" className="flex-1 bg-linear-to-b from-blush/40 to-blush/60">
      <SplitHero
        id="prestations-title"
        eyebrow="Mes soins"
        title={
          <>
            Des soins pour{" "}
            <br className="hidden sm:block" />
            votre bien-être
          </>
        }
        description={soinsIntro}
        imageLabel="Serviette roulée, lys rose, flacons d'huile, galet et bougie"
      />
      <BenefitsSection />
      <SessionQuote />
      <BookingBanner />
    </main>
  );
}
