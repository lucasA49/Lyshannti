// Limitation des tentatives de connexion (anti-force brute), table login_attempts.
// Par e-mail : 5 échecs en 15 minutes. Par adresse IP : 20 échecs en 15 minutes.

import { db } from "@/lib/db"

const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES_PER_EMAIL = 5
const MAX_FAILURES_PER_IP = 20

export async function isLoginBlocked(email: string, ipAddress: string) {
  const since = new Date(Date.now() - WINDOW_MS)
  const [byEmail, byIp] = await Promise.all([
    db.loginAttempt.count({ where: { email, success: false, createdAt: { gte: since } } }),
    db.loginAttempt.count({ where: { ipAddress, success: false, createdAt: { gte: since } } }),
  ])
  return byEmail >= MAX_FAILURES_PER_EMAIL || byIp >= MAX_FAILURES_PER_IP
}

export async function recordLoginAttempt(email: string, ipAddress: string, success: boolean) {
  await db.loginAttempt.create({ data: { email, ipAddress, success } })
  // Ménage : les tentatives de plus de 24 h ne servent plus.
  if (Math.random() < 0.05) {
    await db.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } })
  }
}
