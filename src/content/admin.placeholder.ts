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
  subject: string
  createdAt: string
  status: ContactStatus
}[] = [
  { id: "c1", name: "Camille R.", subject: "Prendre rendez-vous", createdAt: fromNow(0, 8), status: "NEW" },
  { id: "c2", name: "Sophie M.", subject: "Soin énergétique", createdAt: fromNow(-1, 15), status: "NEW" },
  { id: "c3", name: "Julie B.", subject: "Accompagnement personnalisé", createdAt: fromNow(-2, 10), status: "NEW" },
  { id: "c4", name: "Nadia K.", subject: "Autre demande", createdAt: fromNow(-3, 17), status: "IN_PROGRESS" },
  { id: "c5", name: "Laura P.", subject: "Prendre rendez-vous", createdAt: fromNow(-5, 11), status: "DONE" },
]

export const demoPosts: {
  id: string
  title: string
  status: PostStatus
  updatedAt: string
  /** Date de publication (passée) ou programmée (future). */
  publishedAt?: string
  views: number
  seoIssues: ("metaDescription" | "imageAlt" | "coverImage" | "focusKeyword")[]
}[] = [
  { id: "p1", title: "Les bienfaits d'un soin énergétique", status: "DRAFT", updatedAt: fromNow(0, 7), views: 0, seoIssues: ["metaDescription", "coverImage"] },
  { id: "p2", title: "Libérer les mémoires émotionnelles", status: "SCHEDULED", updatedAt: fromNow(-1, 18), publishedAt: fromNow(2), views: 0, seoIssues: ["focusKeyword"] },
  { id: "p3", title: "Retrouver son ancrage au quotidien", status: "SCHEDULED", updatedAt: fromNow(-1, 9), publishedAt: fromNow(6), views: 0, seoIssues: [] },
  { id: "p4", title: "Développer son intuition", status: "SCHEDULED", updatedAt: fromNow(-2, 14), publishedAt: fromNow(9), views: 0, seoIssues: ["imageAlt"] },
  { id: "p5", title: "5 gestes essentiels pour une peau éclatante au naturel", status: "PUBLISHED", updatedAt: fromNow(-3, 10), publishedAt: fromNow(-3), views: 320, seoIssues: [] },
  { id: "p6", title: "Comment réduire le stress au quotidien ?", status: "PUBLISHED", updatedAt: fromNow(-8, 10), publishedAt: fromNow(-8), views: 280, seoIssues: ["imageAlt"] },
  { id: "p7", title: "Les bienfaits du massage relaxant", status: "PUBLISHED", updatedAt: fromNow(-20, 10), publishedAt: fromNow(-20), views: 540, seoIssues: [] },
  { id: "p8", title: "Quelle routine beauté adopter selon votre peau ?", status: "PUBLISHED", updatedAt: fromNow(-25, 10), publishedAt: fromNow(-25), views: 470, seoIssues: ["metaDescription"] },
  { id: "p9", title: "5 plantes apaisantes pour un meilleur sommeil", status: "PUBLISHED", updatedAt: fromNow(-40, 10), publishedAt: fromNow(-40), views: 430, seoIssues: [] },
]
