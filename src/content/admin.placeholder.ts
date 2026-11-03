// ⚠️ PROVISOIRE : données de démonstration du tableau de bord de l'admin.
// Seul `src/lib/admin/dashboard.ts` les lit ; il sera remplacé par des requêtes
// Prisma (tables users, articles, contacts). L'interface affiche un bandeau
// « Données de démonstration » tant qu'elles sont utilisées.

import type { ContactStatus, PostStatus } from "@/lib/admin/dashboard"

// Dates relatives au moment de la génération, pour que la démo reste parlante.
const day = 24 * 60 * 60 * 1000
const fromNow = (days: number, hours = 9) => {
  const date = new Date(Date.now() + days * day)
  date.setUTCHours(hours, 0, 0, 0)
  return date.toISOString()
}

export const demoAdmin = { name: "Administratrice", email: "admin@exemple.fr" }

export const demoContacts: {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: string
  status: ContactStatus
}[] = [
  {
    id: "c1",
    name: "Camille R.",
    email: "camille@exemple.fr",
    phone: "06 00 00 00 01",
    subject: "Prendre rendez-vous",
    message: "Bonjour, je souhaiterais réserver une première séance la semaine prochaine, idéalement en fin de journée. Quelles sont vos disponibilités ? Merci !",
    createdAt: fromNow(0, 8),
    status: "NEW",
  },
  {
    id: "c2",
    name: "Sophie M.",
    email: "sophie@exemple.fr",
    subject: "Soin énergétique",
    message: "Bonjour, une amie m'a parlé de vos soins énergétiques. Comment se déroule une séance et combien de temps dure-t-elle ?",
    createdAt: fromNow(-1, 15),
    status: "NEW",
  },
  {
    id: "c3",
    name: "Julie B.",
    email: "julie@exemple.fr",
    phone: "06 00 00 00 03",
    subject: "Accompagnement personnalisé",
    message: "Bonjour, je traverse une période difficile et je cherche un accompagnement sur plusieurs séances. Proposez-vous un suivi ?",
    createdAt: fromNow(-2, 10),
    status: "NEW",
  },
  {
    id: "c4",
    name: "Nadia K.",
    email: "nadia@exemple.fr",
    subject: "Autre demande",
    message: "Bonjour, proposez-vous des cartes cadeaux ? Je souhaiterais offrir une séance à ma mère pour son anniversaire.",
    createdAt: fromNow(-3, 17),
    status: "IN_PROGRESS",
  },
  {
    id: "c5",
    name: "Laura P.",
    email: "laura@exemple.fr",
    subject: "Prendre rendez-vous",
    message: "Bonjour, est-il possible de décaler mon rendez-vous de jeudi à vendredi ? Merci beaucoup.",
    createdAt: fromNow(-5, 11),
    status: "DONE",
  },
  {
    id: "c6",
    name: "Emma D.",
    email: "emma@exemple.fr",
    phone: "06 00 00 00 06",
    subject: "Soin énergétique",
    message: "Bonjour, les séances peuvent-elles se faire à distance ? J'habite assez loin de Cholet.",
    createdAt: fromNow(-9, 14),
    status: "DONE",
  },
  {
    id: "c7",
    name: "Pauline G.",
    email: "pauline@exemple.fr",
    subject: "Autre demande",
    message: "Bonjour, je voulais simplement vous remercier pour la séance de la semaine dernière, je me sens beaucoup plus apaisée.",
    createdAt: fromNow(-15, 9),
    status: "DONE",
  },
]

export const demoPosts: {
  id: string
  title: string
  slug: string
  /** Slug de la catégorie (voir posts.placeholder.ts). */
  category: string
  status: PostStatus
  updatedAt: string
  /** Date de publication (passée) ou programmée (future). */
  publishedAt?: string
  /** Mis à la corbeille (suppression douce, définitive après 30 jours). */
  deletedAt?: string
  views: number
  seoIssues: ("metaDescription" | "imageAlt" | "coverImage" | "focusKeyword")[]
}[] = [
  { id: "p1", title: "Les bienfaits d'un soin énergétique", slug: "les-bienfaits-d-un-soin-energetique", category: "bien-etre", status: "DRAFT", updatedAt: fromNow(0, 7), views: 0, seoIssues: ["metaDescription", "coverImage"] },
  { id: "p2", title: "Libérer les mémoires émotionnelles", slug: "liberer-les-memoires-emotionnelles", category: "bien-etre", status: "SCHEDULED", updatedAt: fromNow(-1, 18), publishedAt: fromNow(2), views: 0, seoIssues: ["focusKeyword"] },
  { id: "p3", title: "Retrouver son ancrage au quotidien", slug: "retrouver-son-ancrage-au-quotidien", category: "conseils", status: "SCHEDULED", updatedAt: fromNow(-1, 9), publishedAt: fromNow(6), views: 0, seoIssues: [] },
  { id: "p4", title: "Développer son intuition", slug: "developper-son-intuition", category: "conseils", status: "SCHEDULED", updatedAt: fromNow(-2, 14), publishedAt: fromNow(9), views: 0, seoIssues: ["imageAlt"] },
  { id: "p5", title: "5 gestes essentiels pour une peau éclatante au naturel", slug: "5-gestes-essentiels-pour-une-peau-eclatante", category: "beaute-naturelle", status: "PUBLISHED", updatedAt: fromNow(-3, 10), publishedAt: fromNow(-3), views: 320, seoIssues: [] },
  { id: "p6", title: "Comment réduire le stress au quotidien ?", slug: "comment-reduire-le-stress-au-quotidien", category: "bien-etre", status: "PUBLISHED", updatedAt: fromNow(-8, 10), publishedAt: fromNow(-8), views: 280, seoIssues: ["imageAlt"] },
  { id: "p7", title: "Les bienfaits du massage relaxant", slug: "les-bienfaits-du-massage-relaxant", category: "relaxation", status: "PUBLISHED", updatedAt: fromNow(-20, 10), publishedAt: fromNow(-20), views: 540, seoIssues: [] },
  { id: "p8", title: "Quelle routine beauté adopter selon votre peau ?", slug: "quelle-routine-beaute-adopter-selon-votre-peau", category: "beaute-naturelle", status: "PUBLISHED", updatedAt: fromNow(-25, 10), publishedAt: fromNow(-25), views: 470, seoIssues: ["metaDescription"] },
  { id: "p9", title: "5 plantes apaisantes pour un meilleur sommeil", slug: "5-plantes-apaisantes-pour-un-meilleur-sommeil", category: "bien-etre", status: "PUBLISHED", updatedAt: fromNow(-40, 10), publishedAt: fromNow(-40), views: 430, seoIssues: [] },
  { id: "p10", title: "Les rituels de la pleine lune", slug: "les-rituels-de-la-pleine-lune", category: "conseils", status: "DRAFT", updatedAt: fromNow(-12, 16), deletedAt: fromNow(-2, 10), views: 0, seoIssues: ["metaDescription"] },
]
