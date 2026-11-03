import { ApproachSection } from "@/components/home/approach-section";
import { ContactCta } from "@/components/home/contact-cta";
import { Hero } from "@/components/home/hero";
import { LatestPosts } from "@/components/home/latest-posts";
import { ServicesSection } from "@/components/home/services-section";
import { ValuesBar } from "@/components/home/values-bar";

export default function HomePage() {
  return (
    <main id="contenu" className="flex-1">
      <Hero />
      <ValuesBar />
      <ServicesSection />
      <ApproachSection />
      <LatestPosts />
      <ContactCta />
    </main>
  );
}
