import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LotusIcon } from "@/components/brand/lotus-icon";
import { siteConfig } from "@/config/site";
import background from "@/assets/images/admin-login-bg.webp";

// Gabarit des pages d'authentification (connexion, mot de passe oublié…) :
// photo d'ambiance plein écran, logo « Espace Administration » et carte centrée.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col items-center overflow-hidden bg-plum px-4 py-8 sm:py-12">
      <Image
        src={background}
        alt=""
        fill
        placeholder="blur"
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="-z-10 object-cover object-[50%_60%]"
      />
      {/* Voile prune en haut pour la lisibilité du logo. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-plum/70 via-plum/20 to-plum/30" />

      <Link
        href="/"
        className="on-dark absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-plum/50 px-4 py-2 text-sm text-blush backdrop-blur-sm outline-none transition-colors hover:bg-plum/70 focus-visible:ring-3 focus-visible:ring-ring/60"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Retour au site
      </Link>

      <header className="mt-10 text-center text-blush sm:mt-6">
        <LotusIcon className="mx-auto h-12 w-20 text-gold sm:h-14 sm:w-24" />
        <p className="mt-2 font-heading text-5xl font-semibold tracking-tight sm:text-6xl">{siteConfig.name}</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <span aria-hidden="true" className="h-px w-12 bg-gold sm:w-20" />
          <p className="font-heading text-lg sm:text-xl">Espace Administration</p>
          <span aria-hidden="true" className="h-px w-12 bg-gold sm:w-20" />
        </div>
      </header>

      <main id="contenu" className="mt-8 w-full max-w-lg flex-1 sm:mt-10">
        {children}
      </main>
    </div>
  );
}
