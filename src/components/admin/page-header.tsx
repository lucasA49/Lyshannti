import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// En-tête des pages du back-office : lien retour facultatif, titre et description.
function AdminPageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string
  description?: string
  back?: { href: string; label: string }
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="mb-2 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-plum/75 outline-none hover:text-plum focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {back.label}
          </Link>
        )}
        <h1 className="font-heading text-3xl font-semibold text-plum sm:text-4xl">{title}</h1>
        {description && <p className="mt-1 text-plum/75">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

export { AdminPageHeader }
