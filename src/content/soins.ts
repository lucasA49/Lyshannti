// Contenu de la page Prestations, repris du visuel « Mes soins pour ton
// bien-être » fourni par la cliente et adapté au vouvoiement.

export const soinsIntro =
  "Mes soins énergétiques et médiumniques agissent en profondeur sur les plans physique, émotionnel, mental et spirituel. Ils permettent de libérer ce qui vous alourdit, de rééquilibrer vos énergies et de vous reconnecter à votre essence véritable."

export type SoinBenefit = {
  icon: "lotus" | "moon" | "crystal" | "spiral" | "heart" | "sprout"
  text: string
}

export const soinsBenefits: SoinBenefit[] = [
  { icon: "lotus", text: "Libérer les mémoires émotionnelles et transgénérationnelles" },
  { icon: "moon", text: "Nettoyer les énergies parasites et les entités" },
  { icon: "crystal", text: "Travailler sur les vies antérieures et les schémas répétitifs" },
  { icon: "spiral", text: "Harmoniser votre alignement et votre ancrage" },
  { icon: "heart", text: "Développer votre connexion à votre âme et à votre intuition" },
  { icon: "sprout", text: "Retrouver paix intérieure, clarté et confiance en vous" },
]

export const soinsQuote = {
  text: "Chaque séance est un espace sacré, rien que pour vous, où transformation, guérison et reconnexion se réalisent.",
  signature: "Prendre soin de vous, c'est vous honorer.",
}
