import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

// Visuel de partage 1200×630 (public/og-image.png) aux couleurs de la marque.
export const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} – ${siteConfig.tagline}`,
}

// Métadonnées d'une page publique : titre, description, URL canonique et
// Open Graph / Twitter complets (Next remplace ces objets en entier, ils ne
// fusionnent pas avec ceux du layout). `path` commence par « / ».
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string
  description: string
  path: string
}): Metadata {
  const socialTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name

  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      url: path,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage.url],
    },
  }
}
