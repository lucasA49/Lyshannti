"use client"

import { useSyncExternalStore } from "react"

import { formatLongDate } from "@/lib/admin/format"

// La date du jour est lue dans le navigateur (et non au build) : elle reste
// juste même sur une page générée à l'avance.
const subscribe = () => () => {}

function Greeting({ name }: { name: string }) {
  const today = useSyncExternalStore(
    subscribe,
    () => formatLongDate(new Date()),
    () => ""
  )

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-plum sm:text-4xl">
        Bonjour {name}
      </h1>
      <p className="mt-1 min-h-6 text-plum/75 first-letter:uppercase">{today}</p>
    </div>
  )
}

export { Greeting }
