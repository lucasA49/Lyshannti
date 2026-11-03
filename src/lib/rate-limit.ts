// Limiteur simple en mémoire (par instance du serveur), pour les formulaires
// publics : suffisant contre les envois en rafale d'un même visiteur.
// L'adresse IP n'est ni stockée en base ni conservée au-delà de la fenêtre.

const hits = new Map<string, number[]>()

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) hits.clear()
  return true
}
