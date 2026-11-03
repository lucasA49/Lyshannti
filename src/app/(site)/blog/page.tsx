import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = pageMetadata({
  title: "Le blog",
  description: "Conseils, astuces et actualités pour prendre soin de vous au quotidien.",
  path: "/blog",
});

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
