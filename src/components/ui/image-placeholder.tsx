import { Flower2 } from "lucide-react"
import { cn } from "cn"

// Cadre provisoire à remplacer par une vraie photo (next/image).
// `label` décrit la photo attendue : il sert de texte alternatif en attendant.
function ImagePlaceholder({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex flex-col items-center justify-center gap-2 bg-blush bg-linear-to-br from-blush via-blush/70 to-gold/40 text-plum/40",
        className
      )}
    >
      <Flower2 className="size-10" strokeWidth={1.2} aria-hidden="true" />
      <span className="px-4 text-center text-xs font-medium">{label}</span>
    </div>
  )
}

export { ImagePlaceholder }
