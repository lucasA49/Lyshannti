import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: "fr",
    start_url: ".",
    display: "browser",
    background_color: "#f9f1ef",
    theme_color: "#211325",
    icons: [{ src: "icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
