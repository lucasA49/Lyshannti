import type { NextConfig } from "next";

// Démo sur GitHub Pages : export statique servi sous /Lyshannti.
// Activé uniquement par le workflow GitHub Actions (GITHUB_PAGES=true) ;
// en local et sur un futur hébergement avec backend, rien ne change.
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: "export",
    basePath: "/Lyshannti",
    trailingSlash: true,
    images: { unoptimized: true },
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
