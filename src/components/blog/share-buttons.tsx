"use client"

import { useState } from "react"
import { Check, Link2 } from "lucide-react"

import { FacebookIcon, LinkedinIcon } from "@/components/brand/social-icons"

const buttonClass =
  "flex size-10 items-center justify-center rounded-full bg-plum text-blush outline-none transition-colors hover:bg-gold hover:text-plum focus-visible:ring-3 focus-visible:ring-ring/50"

// Partage par simples liens (aucun script ni cookie des réseaux sociaux).
// Instagram ne propose pas de lien de partage web : il n'est donc pas listé.
function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const encoded = encodeURIComponent(url)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Presse-papiers indisponible (navigateur ancien ou refusé) : rien à faire.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="font-heading text-lg font-semibold text-plum">Partager cet article&nbsp;:</p>
      <ul className="flex items-center gap-2">
        <li>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Partager « ${title} » sur Facebook (nouvel onglet)`}
            className={buttonClass}
          >
            <FacebookIcon className="size-5" />
          </a>
        </li>
        <li>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Partager « ${title} » sur LinkedIn (nouvel onglet)`}
            className={buttonClass}
          >
            <LinkedinIcon className="size-5" />
          </a>
        </li>
        <li>
          <button type="button" onClick={copy} aria-label="Copier le lien de l'article" className={buttonClass}>
            {copied ? <Check className="size-5" aria-hidden="true" /> : <Link2 className="size-5" aria-hidden="true" />}
          </button>
        </li>
      </ul>
      <p role="status" className="text-sm text-plum/75">
        {copied ? "Lien copié !" : ""}
      </p>
    </div>
  )
}

export { ShareButtons }
