// Paramètres du site (page /admin/parametres). Table settings si la base est
// disponible ; sinon undefined (la page utilise alors siteConfig).

import type { SiteSettings } from "@/components/admin/settings/settings-form"

export async function getSiteSettings(): Promise<SiteSettings | undefined> {
  if (!process.env.DATABASE_URL) return undefined
  return (await import("@/lib/admin/admin-db")).getSiteSettings()
}
