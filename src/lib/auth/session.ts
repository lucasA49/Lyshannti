// Session admin côté serveur. À appeler dans chaque page, Server Action et
// Route Handler de l'admin : le proxy (proxy.ts) ne fait qu'une première
// redirection, il ne suffit pas à protéger les données.

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth/options"
import { db } from "@/lib/db"

export type AdminUser = { id: string; name: string; email: string }

/** Admin connecté, ou null (session absente, expirée ou révoquée). */
export async function getAdminSession(): Promise<AdminUser | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.expired) return null

  // Revérifie en base : compte supprimé ou sessionVersion changée = session révoquée.
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, sessionVersion: true },
  })
  if (!user || user.sessionVersion !== session.sessionVersion) return null

  return { id: user.id, name: user.name, email: user.email }
}

/** Comme getAdminSession, mais redirige vers la connexion si besoin. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminSession()
  if (!admin) redirect("/admin/connexion")
  return admin
}
