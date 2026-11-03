import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { ApproachSection } from "@/components/home/approach-section";
import { ContactCta } from "@/components/home/contact-cta";
import { Hero } from "@/components/home/hero";
import { LatestPosts } from "@/components/home/latest-posts";
import { ServicesSection } from "@/components/home/services-section";
import { ValuesBar } from "@/components/home/values-bar";

export const metadata: Metadata = pageMetadata({
  description: siteConfig.description,
  path: "/",
});

// Identité du site pour les moteurs de recherche. Adresse, téléphone et horaires
// (LocalBusiness) seront ajoutés quand les vraies coordonnées seront connues.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: `${siteConfig.url}/`,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "fr-FR",
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: `${siteConfig.url}/`,
      logo: `${siteConfig.url}/icon.svg`,
      slogan: siteConfig.tagline,
    },
  ],
};

export default function HomePage() {
  return (
    <main id="contenu" className="flex-1">
      <JsonLd data={structuredData} />
      <Hero />
      <ValuesBar />
      <ServicesSection />
      <ApproachSection />
      <LatestPosts />
      <ContactCta />
    </main>
  );
}
