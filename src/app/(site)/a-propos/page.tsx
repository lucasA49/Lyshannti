import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "À propos",
  description: "Mon histoire, mon parcours et les valeurs qui guident chaque accompagnement.",
};

export default function AboutPage() {
  return (
    <main id="contenu" className="flex-1">
      <PageHero
        title="À propos"
        description="Mon histoire, mon parcours et les valeurs qui guident chaque accompagnement."
      />
    </main>
  );
}
