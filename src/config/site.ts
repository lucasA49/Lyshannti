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
  // ⚠️ PROVISOIRE : coordonnées reprises de la maquette, à remplacer par les vraies.
  contact: {
    phone: "06 12 34 56 78",
    email: "contact@lyshannti.fr",
    city: "Cholet, France",
    hours: { short: "Lun – Ven : 9h – 18h", full: "Du lundi au vendredi, de 9h à 18h" },
  },
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
