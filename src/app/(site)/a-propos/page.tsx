import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

import { QuoteBanner } from "@/components/about/quote-banner";
import { StorySection } from "@/components/about/story-section";
import { ValuesSection } from "@/components/about/values-section";
import { SplitHero } from "@/components/layout/split-hero";
import heroImage from "@/assets/images/a-propos-hero.webp";

const description =
  "Une approche bienveillante et personnalisée de la beauté et du bien-être, pour révéler votre beauté naturelle.";

export const metadata: Metadata = pageMetadata({
  title: "À propos",
  description,
  path: "/a-propos",
});

export default function AboutPage() {
  return (
    <main id="contenu" className="flex-1 bg-linear-to-b from-blush/40 to-blush/60">
      <SplitHero
        id="about-title"
        eyebrow="À propos"
        title={
          <>
            Découvrir l&apos;univers{" "}
            <br className="hidden sm:block" />
            de Lyshannti
          </>
        }
        description={description}
        image={heroImage}
        imageLabel="Femme de dos, un lys rose dans le chignon, entourée de bougies et de fleurs"
      />
      <StorySection />
      <ValuesSection />
      <QuoteBanner />
    </main>
  );
}
