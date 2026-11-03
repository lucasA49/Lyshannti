// Lotus au trait, utilisé pour le logo et comme motif décoratif.
// La couleur suit `currentColor`.
function LotusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 64 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M32 4C24 14 24 26 32 36C40 26 40 14 32 4Z" />
      <path d="M32 36C22 32 15 23 15 12C23 15 29 22 32 36Z" />
      <path d="M32 36C42 32 49 23 49 12C41 15 35 22 32 36Z" />
      <path d="M32 36C20 36 9 30 3 21C13 19 24 24 32 36Z" />
      <path d="M32 36C44 36 55 30 61 21C51 19 40 24 32 36Z" />
    </svg>
  )
}

export { LotusIcon }
