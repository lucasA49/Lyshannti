import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question, un projet, envie d'un accompagnement ? Je suis à votre écoute.",
};

export default function ContactPage() {
  return (
    <main id="contenu" className="flex-1">
      <PageHero
        title="Contact"
        description="Une question, un projet, envie d'un accompagnement ? Je suis à votre écoute."
      />
    </main>
  );
}
