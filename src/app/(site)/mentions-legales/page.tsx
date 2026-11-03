import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales",
  description: "Informations légales relatives au site Lyshannti.",
  path: "/mentions-legales",
});

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
