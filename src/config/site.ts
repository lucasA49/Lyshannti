export const siteConfig = {
  name: "Lyshannti",
  tagline: "L'élégance du bien-être",
  description:
    "Des prestations uniques et personnalisées pour révéler votre beauté naturelle.",
  nav: [
    { label: "Accueil", href: "/" },
    { label: "Prestations", href: "/prestations" },
    { label: "À propos", href: "/a-propos" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "Prendre rendez-vous", href: "/contact" },
  // À compléter : un réseau sans URL n'est pas affiché dans le footer.
  socials: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
