import { Feather, Heart, Leaf, Lightbulb, Sparkles } from "lucide-react"
import { cn } from "cn"

import { LotusIcon } from "@/components/brand/lotus-icon"
import type { CategoryIcon as CategoryIconName } from "@/lib/blog"

// Icône d'une catégorie du blog. La liste est fermée : l'admin choisira parmi
// ces noms (champ `icon` de la table categories).
function CategoryIcon({ name, className }: { name: CategoryIconName; className?: string }) {
  const props = { "aria-hidden": true, strokeWidth: 1.6, className: cn("size-5", className) }

  switch (name) {
    case "sparkles":
      return <Sparkles {...props} />
    case "heart":
      return <Heart {...props} />
    case "leaf":
      return <Leaf {...props} />
    case "feather":
      return <Feather {...props} />
    case "lightbulb":
      return <Lightbulb {...props} />
    default:
      return <LotusIcon aria-hidden="true" strokeWidth={2.2} className={cn("h-5 w-7", className)} />
  }
}

export { CategoryIcon }
