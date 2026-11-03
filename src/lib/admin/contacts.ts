// Demandes de contact (page Contacts de l'admin) : SEUL point de lecture.
// Aujourd'hui : démonstration. Demain : Prisma (table contacts), après
// vérification de la session admin. Recherche, filtre et pagination se feront
// alors côté serveur (searchParams), avec un index sur (status, createdAt).
//
// Règle RGPD décidée : suppression automatique 12 mois après la demande
// (tâche planifiée), indiquée dans la politique de confidentialité.

import { demoContacts } from "@/content/admin.placeholder"
import type { ContactStatus } from "@/lib/admin/dashboard"

export const CONTACT_RETENTION_MONTHS = 12

export type ContactRecord = {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: string
  status: ContactStatus
}

export async function getContacts(): Promise<ContactRecord[]> {
  return [...demoContacts].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getContact(id: string): Promise<ContactRecord | undefined> {
  return demoContacts.find((contact) => contact.id === id)
}

/** Date de suppression automatique d'une demande. */
export function contactDeletionDate(createdAt: string) {
  const date = new Date(createdAt)
  date.setMonth(date.getMonth() + CONTACT_RETENTION_MONTHS)
  return date
}
