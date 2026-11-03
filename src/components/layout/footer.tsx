import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/brand/social-icons"
import { Container } from "@/components/layout/container"
import { NavLinks } from "@/components/layout/nav-links"
import { siteConfig } from "@/config/site"
import { getPublicSettings } from "@/lib/site-settings"

const linkClass =
  "rounded-sm text-blush/80 outline-none transition-colors hover:text-gold focus-visible:ring-3 focus-visible:ring-ring/60"

async function Footer() {
  const settings = await getPublicSettings()
  const socialLinks = [
    { label: "Instagram", href: settings.instagram, Icon: InstagramIcon },
    { label: "Facebook", href: settings.facebook, Icon: FacebookIcon },
    { label: "LinkedIn", href: settings.linkedin, Icon: LinkedinIcon },
  ].filter((social) => social.href)

  return (
    <footer className="on-dark border-t border-gold/40 bg-plum text-blush">
      <Container className="flex flex-col items-center gap-8 py-10 text-center lg:flex-row lg:justify-between lg:text-left">
        <div>
          <Logo />
          <p className="mt-1 text-sm text-blush/70 lg:pl-[3.4rem]">
            {settings.tagline}
          </p>
        </div>

        <nav aria-label="Navigation du pied de page">
          <NavLinks className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm" />
        </nav>

        {socialLinks.length > 0 && (
          <ul className="flex gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${siteConfig.name} sur ${label} (nouvel onglet)`}
                  className="flex size-11 items-center justify-center rounded-full border border-gold text-gold outline-none transition-colors hover:bg-gold hover:text-plum focus-visible:ring-3 focus-visible:ring-ring/60"
                >
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>

      <Container>
        <div className="flex flex-col items-center gap-3 border-t border-blush/15 py-6 text-xs text-blush/70 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits
            réservés.
          </p>
          <p>
            Réalisé avec  {" "}
            <span role="img" aria-label="amour">
              ❤️ 
            </span>{"    "}
                 par AK Agency
          </p>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {siteConfig.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}

export { Footer }
