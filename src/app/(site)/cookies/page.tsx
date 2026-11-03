import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = pageMetadata({
  title: "Cookies",
  description: "Les cookies utilisés sur ce site et la manière de les gérer.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <main id="contenu" className="flex-1">
      <PageHero
        title="Cookies"
        description="Les cookies utilisés sur ce site et la manière de les gérer."
      />
    </main>
  );
}
