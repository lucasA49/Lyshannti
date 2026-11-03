// Formats de dates de l'admin (fuseau de Paris : la cliente travaille en France).
const timeZone = "Europe/Paris"

const dayMonth = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone })
const dayMonthTime = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone,
})
const weekday = new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone })
const longDate = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone,
})

export const formatDayMonth = (iso: string) => dayMonth.format(new Date(iso))
export const formatDayMonthTime = (iso: string) => dayMonthTime.format(new Date(iso))
export const formatWeekday = (date: Date) => weekday.format(date)
export const formatLongDate = (date: Date) => longDate.format(date)

/** Clé « AAAA-MM-JJ » d'une date à Paris (pour regrouper par jour). */
export function parisDayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(date)
}
