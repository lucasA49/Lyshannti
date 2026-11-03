import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react"
import { cn } from "cn"

import { siteConfig } from "@/config/site"

const { phone, email, city, hours } = siteConfig.contact

const linkClass =
  "rounded-sm outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"

type InfoItem = {
  Icon: LucideIcon
  content: React.ReactNode
}

const items: InfoItem[] = [
  {
    Icon: Phone,
    content: (
      <a href={`tel:${phone.replace(/[^+0-9]/g, "")}`} className={linkClass}>
        <span className="sr-only">Téléphone : </span>
        {phone}
      </a>
    ),
  },
  {
    Icon: Mail,
    content: (
      <a href={`mailto:${email}`} className={`${linkClass} break-all`}>
        <span className="sr-only">Email : </span>
        {email}
      </a>
    ),
  },
  {
    Icon: MapPin,
    content: (
      <>
        <span className="sr-only">Adresse : </span>
        {city}
      </>
    ),
  },
  {
    Icon: Clock,
    content: (
      <>
        <span aria-hidden="true">{hours.short}</span>
        <span className="sr-only">Horaires : {hours.full}</span>
      </>
    ),
  },
]

function ContactInfo({ className }: { className?: string }) {
  return (
    <address
      className={cn(
        "rounded-3xl border border-gold/30 bg-white/60 px-6 py-3 not-italic shadow-sm shadow-plum/5",
        className
      )}
    >
      <ul className="grid sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-1">
        {items.map(({ Icon, content }, index) => (
          <li
            key={index}
            className="flex items-center gap-5 border-b border-plum/10 py-4 last:border-0 sm:border-0 lg:border-b lg:last:border-0"
          >
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gold/70 to-blush text-plum shadow-sm"
            >
              <Icon className="size-6" strokeWidth={1.75} />
            </span>
            <p className="text-lg text-plum">{content}</p>
          </li>
        ))}
      </ul>
    </address>
  )
}

export { ContactInfo }
