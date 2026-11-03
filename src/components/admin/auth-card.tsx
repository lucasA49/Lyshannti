import { LotusIcon } from "@/components/brand/lotus-icon"

// Carte rose poudré bordée d'or des pages d'authentification de l'admin.
function AuthCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby="auth-title"
      className="relative overflow-hidden rounded-[2rem] border-2 border-gold/80 bg-linear-to-b from-[#fbf1ef]/95 to-blush/95 px-6 pt-8 pb-20 shadow-2xl shadow-plum/40 backdrop-blur-sm sm:px-10 sm:pt-10"
    >
      <span
        aria-hidden="true"
        className="mx-auto flex size-20 items-center justify-center rounded-full border-2 border-gold bg-white/40 text-plum"
      >
        {icon}
      </span>
      <h1 id="auth-title" className="mt-5 text-center font-heading text-3xl font-semibold text-plum sm:text-[2.1rem]">
        {title}
      </h1>
      <p className="mt-2 text-center text-plum/80">{description}</p>

      <div className="mt-8">{children}</div>

      {/* Lotus et vagues dorées en bas de la carte, comme sur la maquette. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center">
        <LotusIcon strokeWidth={1.8} className="h-10 w-16 text-gold" />
        <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="-mt-1 h-6 w-full text-gold">
          <path d="M0 20 C90 4 150 4 200 16 C250 4 310 4 400 20" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      </div>
    </section>
  )
}

export { AuthCard }
