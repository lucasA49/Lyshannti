import Link from "next/link";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageHero } from "@/components/layout/page-hero";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu" className="flex-1">
        <PageHero
          title="Page introuvable"
          description="La page que vous cherchez n'existe pas ou a été déplacée."
        />
        <div className="py-12 text-center">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "gold", size: "cta" }))}
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
