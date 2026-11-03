import { cn } from "cn"

import {
  contactStatusLabels,
  postStatusLabels,
  type ContactStatus,
  type PostStatus,
} from "@/lib/admin/dashboard"

// Briques visuelles communes du tableau de bord.

export function Panel({
  id,
  title,
  action,
  className,
  children,
}: {
  id: string
  title: string
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn("min-w-0 rounded-3xl border border-gold/25 bg-white p-5 shadow-sm shadow-plum/5 sm:p-6", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h2 id={id} className="flex items-center gap-3 font-heading text-xl font-semibold text-plum">
          <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-gold" />
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

const contactStatusStyles: Record<ContactStatus, string> = {
  NEW: "bg-gold text-plum",
  IN_PROGRESS: "bg-blush text-plum",
  DONE: "border border-plum/20 text-plum/70",
}

const postStatusStyles: Record<PostStatus, string> = {
  DRAFT: "border border-plum/20 text-plum/70",
  SCHEDULED: "bg-blush text-plum",
  PUBLISHED: "bg-plum text-blush",
}

export function StatusBadge(
  props: { kind: "contact"; status: ContactStatus } | { kind: "post"; status: PostStatus }
) {
  const label =
    props.kind === "contact" ? contactStatusLabels[props.status] : postStatusLabels[props.status]
  const style =
    props.kind === "contact" ? contactStatusStyles[props.status] : postStatusStyles[props.status]

  return (
    <span className={cn("inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", style)}>
      {label}
    </span>
  )
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl bg-blush/30 px-4 py-6 text-center text-sm text-plum/75">{children}</p>
}
