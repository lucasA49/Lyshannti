import Form from "next/form"
import { Search } from "lucide-react"

// Recherche en GET vers /blog/recherche?q=… (next/form : navigation côté client,
// et fonctionne aussi sans JavaScript).
function SearchForm({ defaultValue }: { defaultValue?: string }) {
  return (
    <Form action="/blog/recherche/" role="search" className="relative">
      <label htmlFor="blog-search" className="sr-only">
        Rechercher un article
      </label>
      <input
        id="blog-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Rechercher…"
        maxLength={100}
        className="h-12 w-full rounded-xl border border-plum/25 bg-white/80 pr-12 pl-4 text-base text-plum outline-none placeholder:text-plum/50 focus-visible:border-plum focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <button
        type="submit"
        aria-label="Lancer la recherche"
        className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-plum outline-none hover:bg-blush focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Search className="size-5" aria-hidden="true" />
      </button>
    </Form>
  )
}

export { SearchForm }
