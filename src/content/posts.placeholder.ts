// ⚠️ PROVISOIRE : catégories et articles de démonstration repris des maquettes.
// Ils seront remplacés par la base de données (Prisma) : seul `src/lib/blog.ts`
// les lit, les pages et composants passent toujours par lui.
// Seul le premier article a un contenu (repris de la maquette « 5 gestes ») et
// donc une page ; les autres renvoient vers /blog (`placeholder`).

import type { BlogCategory, PostDetail, PostSummary } from "@/lib/blog"
import type { RichTextDoc, RichTextNode } from "@/lib/rich-text"

export const categoriesPlaceholder: BlogCategory[] = [
  { slug: "beaute-naturelle", name: "Beauté naturelle", icon: "sparkles" },
  { slug: "bien-etre", name: "Bien-être", icon: "heart" },
  { slug: "soins", name: "Soins", icon: "leaf" },
  { slug: "relaxation", name: "Relaxation", icon: "feather" },
  { slug: "conseils", name: "Conseils", icon: "lightbulb" },
]

const category = (slug: string) =>
  categoriesPlaceholder.find((c) => c.slug === slug)!

// Petits raccourcis pour écrire le document Tiptap de démonstration.
const text = (value: string): RichTextNode => ({ type: "text", text: value })
const paragraph = (value: string): RichTextNode => ({ type: "paragraph", content: [text(value)] })
const heading = (value: string): RichTextNode => ({ type: "heading", attrs: { level: 2 }, content: [text(value)] })

const gestesContent: RichTextDoc = {
  type: "doc",
  content: [
    heading("1. Nettoyer sa peau en douceur"),
    paragraph("Un nettoyage matin et soir élimine les impuretés, l'excès de sébum et les résidus de pollution. Privilégiez un nettoyant doux, adapté à votre type de peau, pour préserver son équilibre naturel."),
    heading("2. Hydrater quotidiennement"),
    paragraph("L'hydratation est la clé d'une peau souple et éclatante. Utilisez une crème ou une huile végétale nourrissante, riche en actifs naturels, pour renforcer la barrière cutanée."),
    heading("3. Exfolier régulièrement"),
    paragraph("Un gommage doux, une à deux fois par semaine, aide à éliminer les cellules mortes et à stimuler le renouvellement cellulaire, pour un teint plus lumineux."),
    heading("4. Protéger sa peau"),
    paragraph("La protection est essentielle, même au quotidien. Une crème avec un filtre solaire naturel ou minéral préserve la peau des effets du soleil et du vieillissement prématuré."),
    heading("5. Adopter une hygiène de vie équilibrée"),
    paragraph("Une peau éclatante passe aussi par l'intérieur : une alimentation riche en antioxydants, une bonne hydratation, un sommeil de qualité et la gestion du stress contribuent à sa beauté naturelle."),
    {
      type: "pullQuote",
      content: [paragraph("Une peau éclatante est le reflet d'une routine attentionnée et d'un équilibre global entre soins, bien-être et hygiène de vie.")],
    },
  ],
}

export const postsPlaceholder: ((PostSummary & Partial<PostDetail>) & { views: number })[] = [
  {
    slug: "5-gestes-essentiels-pour-une-peau-eclatante",
    title: "5 gestes essentiels pour une peau éclatante au naturel",
    category: category("beaute-naturelle"),
    publishedAt: "2026-01-12",
    readingMinutes: 5,
    coverAlt: "Femme détendue avec un masque de soin sur le visage",
    excerpt:
      "Adopter une routine simple et naturelle peut faire toute la différence pour la santé et l'éclat de votre peau. Découvrez 5 gestes essentiels, faciles à intégrer au quotidien, pour révéler une peau lumineuse, douce et pleine de vitalité.",
    content: gestesContent,
    tags: [
      { slug: "routine", name: "Routine" },
      { slug: "soin-visage", name: "Soin visage" },
      { slug: "beaute-naturelle", name: "Beauté naturelle" },
    ],
    views: 320,
  },
  {
    slug: "comment-reduire-le-stress-au-quotidien",
    title: "Comment réduire le stress au quotidien ?",
    category: category("bien-etre"),
    publishedAt: "2026-01-09",
    readingMinutes: 6,
    coverAlt: "Galets empilés et bougie allumée",
    placeholder: true,
    views: 280,
  },
  {
    slug: "les-bienfaits-des-huiles-naturelles-pour-le-corps",
    title: "Les bienfaits des huiles naturelles pour le corps",
    category: category("soins"),
    publishedAt: "2026-01-05",
    readingMinutes: 4,
    coverAlt: "Flacons d'huile, orchidée rose et serviette",
    placeholder: true,
    views: 190,
  },
  {
    slug: "nos-rituels-bien-etre-du-matin",
    title: "Nos rituels bien-être du matin",
    category: category("conseils"),
    publishedAt: "2026-01-02",
    readingMinutes: 5,
    coverAlt: "Tasse de tisane entourée de fleurs",
    placeholder: true,
    views: 210,
  },
  {
    slug: "les-bienfaits-du-massage-relaxant",
    title: "Les bienfaits du massage relaxant",
    category: category("relaxation"),
    publishedAt: "2025-12-22",
    readingMinutes: 4,
    coverAlt: "Massage relaxant du dos",
    placeholder: true,
    views: 540,
  },
  {
    slug: "quelle-routine-beaute-adopter-selon-votre-peau",
    title: "Quelle routine beauté adopter selon votre peau ?",
    category: category("beaute-naturelle"),
    publishedAt: "2025-12-18",
    readingMinutes: 6,
    coverAlt: "Flacon d'huile et fleur de lys",
    placeholder: true,
    views: 470,
  },
  {
    slug: "5-plantes-apaisantes-pour-un-meilleur-sommeil",
    title: "5 plantes apaisantes pour un meilleur sommeil",
    category: category("bien-etre"),
    publishedAt: "2025-12-10",
    readingMinutes: 5,
    coverAlt: "Tasse de tisane et fleurs",
    placeholder: true,
    views: 430,
  },
]
