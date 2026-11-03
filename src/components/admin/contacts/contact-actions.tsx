"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { cn } from "cn"

import type { ActionResult } from "@/lib/admin/actions/articles"
import { deleteContact, setContactStatus } from "@/lib/admin/actions/contacts"
import { contactStatusLabels, type ContactStatus } from "@/lib/admin/labels"

const statuses: ContactStatus[] = ["NEW", "IN_PROGRESS", "DONE"]

// Changement de statut et suppression d'une demande (actions serveur).
function ContactActions({ id, status }: { id: string; status: ContactStatus }) {
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-sm font-medium text-plum">Statut</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {statuses.map((value) => (
            <button
              key={value}
              type="button"
              disabled={pending}
              onClick={() => value !== status && startTransition(async () => setResult(await setContactStatus(id, value)))}
              aria-pressed={value === status}
              className={cn(
                "h-10 rounded-full border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                value === status ? "border-plum bg-plum text-blush" : "border-gold/40 text-plum hover:border-plum"
              )}
            >
              {contactStatusLabels[value]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="border-t border-plum/10 pt-5">
        {confirmDelete ? (
          <div role="group" aria-label="Confirmer la suppression" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-plum">
              Supprimer définitivement cette demande&nbsp;? Cette action est irréversible.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const response = await deleteContact(id)
                    if (response) setResult(response)
                  })
                }
                className="h-10 rounded-full bg-destructive px-4 text-sm font-semibold text-white outline-none hover:bg-destructive/90 focus-visible:ring-3 focus-visible:ring-destructive/40"
              >
                Oui, supprimer
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="h-10 rounded-full border border-plum/25 px-4 text-sm font-medium text-plum outline-none hover:border-plum focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-destructive outline-none hover:bg-destructive/5 focus-visible:ring-3 focus-visible:ring-destructive/30"
          >
            <Trash2 aria-hidden="true" className="size-4" />
            Supprimer la demande
          </button>
        )}
      </div>

      {result && (
        <p role="status" className={cn("rounded-xl px-4 py-3 text-sm text-plum", result.ok ? "bg-gold/20" : "border border-destructive/30 bg-destructive/5")}>
          {result.message}
        </p>
      )}
    </div>
  )
}

export { ContactActions }
