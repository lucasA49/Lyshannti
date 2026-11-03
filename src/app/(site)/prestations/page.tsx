import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Nos prestations",
  description: "Soins du visage, soins du corps et accompagnement personnalisé : découvrez les prestations Lyshannti.",
};

export default function PrestationsPage() {
  return (
    <main id="contenu" className="flex-1">
      <PageHero
        title="Nos prestations"
        description="Soins du visage, soins du corps et accompagnement personnalisé : découvrez les prestations Lyshannti."
      />
    </main>
  );
}
