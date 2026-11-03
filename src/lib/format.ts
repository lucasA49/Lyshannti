// Formats d'affichage partagés (fuseau UTC pour un rendu identique serveur/navigateur).
const postDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

const postDateLong = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

/** « 12 janvier 2026 » */
export function formatPostDateLong(isoDate: string) {
  return postDateLong.format(new Date(isoDate))
}

/** « 12 janv. 2026 » */
export function formatPostDate(isoDate: string) {
  return postDate.format(new Date(isoDate))
}

/**
 * Typographie française : espace fine insécable avant ? ! : ; » et après «,
 * pour éviter un « ? » seul en début de ligne.
 */
export function frenchTypo(text: string) {
  return text.replace(/\s+([?!:;»])/g, "\u202f$1").replace(/«\s+/g, "«\u202f")
}
