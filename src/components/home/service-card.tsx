import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button-variants"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { LotusIcon } from "@/components/brand/lotus-icon"
import type { Service } from "@/content/services"

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gold/25 bg-white/70 shadow-lg shadow-plum/5 transition-shadow hover:shadow-xl hover:shadow-plum/10">
      <ImagePlaceholder label={service.imageAlt} className="aspect-16/9" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-1 gap-3 pb-5">
          <LotusIcon className="mt-1 h-6 w-9 shrink-0 text-gold" />
          <div>
            <h3 className="font-heading text-xl font-semibold text-plum">
              {service.title}
            </h3>
            <p className="mt-1.5 text-sm text-plum/75">{service.excerpt}</p>
          </div>
        </div>

        <Link
          href={`/prestations#${service.slug}`}
          className={cn(
            buttonVariants({ variant: "gold", size: "cta-sm" }),
            "self-center"
          )}
        >
          En savoir plus
          <span className="sr-only"> sur {service.title.toLowerCase()}</span>
          <ArrowRight />
        </Link>
      </div>
    </article>
  )
}

export { ServiceCard }
