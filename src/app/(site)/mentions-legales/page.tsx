import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Informations légales relatives au site Lyshannti.",
};

export default function LegalNoticePage() {
  return (
    <main id="contenu" className="flex-1">
      <PageHero
        title="Mentions légales"
        description="Informations légales relatives au site Lyshannti."
      />
    </main>
  );
}
