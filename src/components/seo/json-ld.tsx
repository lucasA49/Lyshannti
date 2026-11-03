// Données structurées Schema.org (JSON-LD), lues par Google pour enrichir
// les résultats de recherche. Les « < » sont échappés (pas d'injection HTML).
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

export { JsonLd }
