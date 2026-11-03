import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Les cookies utilisés sur ce site et la manière de les gérer.",
};

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
