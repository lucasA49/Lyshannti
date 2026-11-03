import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

// Pages publiques. Les articles du blog s'ajouteront ici (Prisma).
const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/prestations", priority: 0.9 },
  { path: "/a-propos", priority: 0.7 },
  { path: "/blog", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  { path: "/mentions-legales", priority: 0.2 },
  { path: "/politique-de-confidentialite", priority: 0.2 },
  { path: "/cookies", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path === "/" ? "/" : `${path}/`}`,
    changeFrequency: "monthly",
    priority,
  }));
}
