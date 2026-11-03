// Vérifications SEO d'un article, recalculées en direct dans l'éditeur.
// Repères usuels : meta titre ≤ 60 caractères, meta description 120–160.

export const META_TITLE_MAX = 60
export const META_DESCRIPTION_MIN = 120
export const META_DESCRIPTION_MAX = 160

export type SeoInput = {
  title: string
  excerpt: string
  slug: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  coverAlt: string
  bodyText: string
  imagesWithoutAlt: number
  internalLinks: number
}

export type SeoCheck = { id: string; label: string; ok: boolean }

const normalize = (text: string) =>
  text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

export function seoChecks(input: SeoInput): SeoCheck[] {
  const keyword = normalize(input.focusKeyword.trim())
  const metaTitle = input.metaTitle || input.title
  const metaDescription = input.metaDescription || input.excerpt
  const has = (text: string) => keyword.length > 0 && normalize(text).includes(keyword)

  return [
    { id: "keyword", label: "Mot-clé principal renseigné", ok: keyword.length > 0 },
    { id: "keyword-title", label: "Mot-clé dans le titre", ok: has(input.title) },
    { id: "keyword-excerpt", label: "Mot-clé dans le chapô", ok: has(input.excerpt) },
    { id: "keyword-slug", label: "Mot-clé dans l'adresse", ok: has(input.slug.replace(/-/g, " ")) },
    {
      id: "meta-title",
      label: `Titre SEO de ${META_TITLE_MAX} caractères maximum`,
      ok: metaTitle.length > 0 && metaTitle.length <= META_TITLE_MAX,
    },
    {
      id: "meta-description",
      label: `Description de ${META_DESCRIPTION_MIN} à ${META_DESCRIPTION_MAX} caractères`,
      ok: metaDescription.length >= META_DESCRIPTION_MIN && metaDescription.length <= META_DESCRIPTION_MAX,
    },
    { id: "cover-alt", label: "Image principale décrite (ALT)", ok: input.coverAlt.trim().length > 0 },
    { id: "images-alt", label: "Toutes les images ont un ALT", ok: input.imagesWithoutAlt === 0 },
    { id: "internal-link", label: "Au moins un lien vers une autre page du site", ok: input.internalLinks > 0 },
    {
      id: "length",
      label: "Au moins 300 mots",
      ok: input.bodyText.split(/\s+/).filter(Boolean).length >= 300,
    },
  ]
}
