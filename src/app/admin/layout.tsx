import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

// Espace d'administration : jamais indexé, titres propres à l'admin.
// Il n'utilise pas le header/footer du site public (groupe « (site) »).
export const metadata: Metadata = {
  title: {
    default: `Administration | ${siteConfig.name}`,
    template: `%s | Administration ${siteConfig.name}`,
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
