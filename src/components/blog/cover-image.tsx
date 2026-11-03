import Image from "next/image"
import { cn } from "cn"

import { ImagePlaceholder } from "@/components/ui/image-placeholder"

// Image principale d'un article : vraie image (optimisée par next/image) si
// elle existe, sinon cadre décoratif. Le conteneur fixe le format (aspect-*).
function CoverImage({
  url,
  alt,
  sizes,
  priority = false,
  className,
}: {
  url?: string
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}) {
  if (!url) return <ImagePlaceholder label={alt} className={className} />

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        {...(priority ? { preload: true, fetchPriority: "high" as const } : {})}
      />
    </div>
  )
}

export { CoverImage }
