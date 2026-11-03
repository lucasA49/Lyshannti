// ⚠️ PROVISOIRE : articles de démonstration repris de la maquette.
// À remplacer par une requête Prisma quand le backend du blog sera prêt.

export type PostPreview = {
  slug: string
  title: string
  category: { name: string; slug: string }
  publishedAt: string // date ISO
  coverAlt: string
}

export const latestPostsPlaceholder: PostPreview[] = [
  {
    slug: "creer-un-espace-de-detente-chez-soi",
    title: "Créer un espace de détente chez soi",
    category: { name: "Bien-être", slug: "bien-etre" },
    publishedAt: "2026-03-12",
    coverAlt: "Flacons d'huiles, serviettes, lavande et bougie",
  },
  {
    slug: "rituels-simples-pour-un-quotidien-plus-serein",
    title: "Rituels simples pour un quotidien plus serein",
    category: { name: "Rituels", slug: "rituels" },
    publishedAt: "2026-03-05",
    coverAlt: "Tasse de tisane entourée de camomille",
  },
  {
    slug: "se-reconnecter-a-soi-par-ou-commencer",
    title: "Se reconnecter à soi : par où commencer ?",
    category: { name: "Équilibre de vie", slug: "equilibre-de-vie" },
    publishedAt: "2026-02-28",
    coverAlt: "Femme les bras ouverts face au coucher du soleil",
  },
]
