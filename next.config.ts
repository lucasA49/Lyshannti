import type { NextConfig } from "next";

// Démo sur GitHub Pages : export statique servi sous /Lyshannti.
// Activé uniquement par le workflow GitHub Actions (GITHUB_PAGES=true) ;
// en local et sur un futur hébergement avec backend, rien ne change.
const isGithubPages = process.env.GITHUB_PAGES === "true";

// En-têtes de sécurité (hébergement avec serveur uniquement : GitHub Pages
// ne permet pas d'en définir). La CSP sera ajoutée avec le backend.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // URL avec « / » final partout (démo statique et futur hébergement) :
  // une seule forme d'URL par page pour le SEO.
  trailingSlash: true,
  ...(isGithubPages && {
    output: "export",
    basePath: "/Lyshannti",
    images: { unoptimized: true },
  }),
  ...(!isGithubPages && {
    async headers() {
      return [{ source: "/:path*", headers: securityHeaders }];
    },
  }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
