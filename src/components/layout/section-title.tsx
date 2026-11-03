import { cn } from "cn"

// Titre de section centré entre deux traits dorés.
function SectionTitle({
  id,
  title,
  subtitle,
  className,
}: {
  id?: string
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn("text-center", className)}>
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <span aria-hidden="true" className="hidden h-px w-16 shrink-0 bg-gold sm:block" />
        <h2
          id={id}
          className="font-heading text-3xl font-semibold text-plum sm:text-4xl"
        >
          {title}
        </h2>
        <span aria-hidden="true" className="hidden h-px w-16 shrink-0 bg-gold sm:block" />
      </div>
      {subtitle && <p className="mt-3 text-plum/75">{subtitle}</p>}
    </div>
  )
}

export { SectionTitle }
