import { ExternalLink } from "lucide-react"
import { cn } from "cn"

import { LotusIcon } from "@/components/brand/lotus-icon"
import {
  choletMapPaths as paths,
  choletMapViewBox,
} from "@/components/contact/cholet-map-paths"

// Carte stylisée de Cholet, dessinée en SVG à partir des données OpenStreetMap
// (grands axes, rivière, parcs). Quelques Ko, aucune image ni service tiers
// chargé par le visiteur (RGPD, performances).
// La licence ODbL impose de garder l'attribution visible.
const osmUrl =
  "https://www.openstreetmap.org/?mlat=47.0600&mlon=-0.8794#map=14/47.0600/-0.8794"

function StaticMap({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "on-dark overflow-hidden rounded-3xl border border-gold/40 bg-plum shadow-md shadow-plum/20",
        className
      )}
    >
      <div className="relative">
        <svg
          viewBox={choletMapViewBox}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="Plan stylisé du centre de Cholet"
          className="block aspect-4/3 w-full sm:aspect-2/1 lg:aspect-video"
        >
          <defs>
            <radialGradient id="map-glow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#3a2340" />
              <stop offset="100%" stopColor="#211325" />
            </radialGradient>
            <radialGradient id="map-vignette" cx="50%" cy="50%" r="70%">
              <stop offset="60%" stopColor="#211325" stopOpacity="0" />
              <stop offset="100%" stopColor="#211325" stopOpacity="0.85" />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#map-glow)" />
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={paths.park} fill="#eed8d4" fillOpacity="0.07" stroke="none" />
            <path d={paths.water} fill="#eed8d4" fillOpacity="0.18" stroke="none" />
            <path d={paths.river} stroke="#eed8d4" strokeOpacity="0.35" strokeWidth="3" />
            <path d={paths.tertiary} stroke="#eed8d4" strokeOpacity="0.22" strokeWidth="0.8" />
            <path d={paths.secondary} stroke="#eed8d4" strokeOpacity="0.4" strokeWidth="1.2" />
            <path d={paths.rail} stroke="#f4d08a" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 3" />
            <path d={paths.major} stroke="#f4d08a" strokeOpacity="0.75" strokeWidth="1.8" />
          </g>
          <rect width="100%" height="100%" fill="url(#map-vignette)" />
        </svg>

        {/* Repère au centre-ville, avec une onde douce (désactivée si
            l'utilisateur préfère réduire les animations). */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 flex size-12 -translate-1/2 items-center justify-center"
        >
          <span className="absolute inset-0 rounded-full bg-gold/40 motion-safe:animate-ping" />
          <span className="relative flex size-11 items-center justify-center rounded-full border-2 border-gold bg-plum shadow-lg shadow-black/40">
            <LotusIcon className="h-4 w-6 text-gold" />
          </span>
        </span>

        <p
          aria-hidden="true"
          className="absolute top-3 left-4 font-heading text-2xl text-blush italic"
        >
          Cholet
          <span className="block font-sans text-xs tracking-[0.2em] text-gold not-italic uppercase">
            Maine-et-Loire
          </span>
        </p>

        <small className="absolute right-2 bottom-2 text-[0.65rem] text-blush/70">
          ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm underline outline-none hover:text-blush focus-visible:ring-3 focus-visible:ring-ring/60"
          >
            OpenStreetMap
          </a>
        </small>
      </div>

      <figcaption className="border-t border-gold/25 px-5 py-3">
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-blush outline-none hover:text-gold focus-visible:ring-3 focus-visible:ring-ring/60"
        >
          Voir Cholet sur la carte
          <ExternalLink aria-hidden="true" className="size-4" />
          <span className="sr-only">(nouvel onglet)</span>
        </a>
      </figcaption>
    </figure>
  )
}

export { StaticMap }
