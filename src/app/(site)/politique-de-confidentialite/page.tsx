import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = pageMetadata({
  title: "Politique de confidentialité",
  description: "Comment vos données personnelles sont collectées, utilisées et protégées.",
  path: "/politique-de-confidentialite",
});

export default function PrivacyPolicyPage() {
  return (
    <main id="contenu" className="flex-1">
      <PageHero
        title="Politique de confidentialité"
        description="Comment vos données personnelles sont collectées, utilisées et protégées."
      />
    </main>
  );
}
