import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Le blog",
  description: "Conseils, astuces et actualités pour prendre soin de vous au quotidien.",
};

export default function BlogPage() {
  return (
    <main id="contenu" className="flex-1">
      <PageHero
        title="Le blog"
        description="Conseils, astuces et actualités pour prendre soin de vous au quotidien."
      />
    </main>
  );
}
