// Lucide ne fournit plus les logos de marques : versions au trait maison.
type IconProps = React.ComponentProps<"svg">

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const

function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H7v3h2v9h3v-9h2.5l.5-3h-3V6.8c0-.5.4-.8.8-.8H15z" />
    </svg>
  )
}

function LinkedinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9.5V18M6 6v.01M10.5 18v-8.5M10.5 13.5c0-2.5 1.5-4 3.5-4s3 1.5 3 4V18" />
    </svg>
  )
}

export { FacebookIcon, InstagramIcon, LinkedinIcon }
