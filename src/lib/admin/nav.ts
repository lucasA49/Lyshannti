import {
  FileText,
  Image,
  LayoutDashboard,
  Mail,
  Settings,
  Tags,
  type LucideIcon,
} from "lucide-react"

// Menu de l'admin. `available: false` = page pas encore construite : l'entrée
// est affichée « Bientôt » au lieu d'un lien vers une page 404.
export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
  available: boolean
  /** Clé du compteur affiché en badge (ex. nouvelles demandes). */
  badge?: "newContacts"
}

export const adminNav: AdminNavItem[] = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard, available: true },
  { label: "Articles", href: "/admin/articles", icon: FileText, available: true },
  { label: "Catégories et tags", href: "/admin/categories", icon: Tags, available: true },
  { label: "Médias", href: "/admin/medias", icon: Image, available: true },
  { label: "Contacts", href: "/admin/contacts", icon: Mail, available: true, badge: "newContacts" },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings, available: true },
]
