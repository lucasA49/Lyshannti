// Icônes dessinées pour les bienfaits des soins (trait fin, couleur héritée),
// dans le même esprit que le lotus de la marque.
type IconProps = React.SVGProps<SVGSVGElement>

function SvgIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

// Lotus épanoui.
function SoinLotusIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M24 34C20 29 20 18 24 10c4 8 4 19 0 24Z" />
      <path d="M24 34c-4-3-8-10-7-18 5 3 8 10 7 18Z" />
      <path d="M24 34c4-3 8-10 7-18-5 3-8 10-7 18Z" />
      <path d="M24 34c-6 0-12-4-15-10 6-1 12 3 15 10Z" />
      <path d="M24 34c6 0 12-4 15-10-6-1-12 3-15 10Z" />
      <path d="M8 38c5-2 11-3 16-3s11 1 16 3" />
    </SvgIcon>
  )
}

// Croissant de lune et étoiles.
function SoinMoonIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M26 8a16 16 0 1 0 14 24A13 13 0 0 1 26 8Z" />
      <path d="M33 13l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
      <path d="M38 22.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6Z" />
    </SvgIcon>
  )
}

// Pointe de cristal (quartz).
function SoinCrystalIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M24 4l7 9v24l-7 7-7-7V13Z" />
      <path d="M17 13l7 4 7-4" />
      <path d="M24 17v27" />
      <path d="M20.5 22v11M27.5 22v11" strokeOpacity={0.5} />
    </SvgIcon>
  )
}

// Spirale (alignement, ancrage).
function SoinSpiralIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M22.5 24 22.3 23.6 22.2 23.2 22.3 22.7 22.4 22.2 22.7 21.7 23.1 21.3 23.7 21 24.3 20.8 25.1 20.7 25.8 20.8 26.6 21.1 27.3 21.6 28 22.2 28.5 23 28.8 24 28.9 25 28.8 26.1 28.4 27.2 27.8 28.2 26.9 29.1 25.9 29.8 24.7 30.3 23.3 30.5 21.9 30.4 20.5 30.1 19.2 29.4 18 28.4 17 27.1 16.3 25.6 15.9 24 15.9 22.3 16.2 20.5 16.9 18.9 18 17.3 19.4 16 21.1 15 23 14.4 25 14.2 27.1 14.4 29.1 15.1 31 16.2 32.7 17.7 34 19.5 34.9 21.7 35.4 24 35.4 26.4 34.8 28.8 33.8 31.1 32.2 33.1 30.2 34.8 27.9 36.1 25.4 36.9 22.6 37.1 19.9 36.7 17.2 35.8 14.8 34.3 12.6 32.2 11 29.8 9.8 27 9.3 24 9.4 20.9 10.2 17.8 11.6 15 13.6 12.4 16.1 10.3 19.1 8.8 22.3 7.9 25.7 7.6 29.2 8.1 32.4 9.4 35.5 11.3 38 13.8" />
    </SvgIcon>
  )
}

// Cœur.
function SoinHeartIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M24 40C11 32 6 25 6 18a9 9 0 0 1 18-2.5A9 9 0 0 1 42 18c0 7-5 14-18 22Z" />
      <path d="M15 17a4 4 0 0 1 4-3" strokeOpacity={0.5} />
    </SvgIcon>
  )
}

// Rameau de feuilles (sérénité, croissance).
function SoinBranchIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M24 44V8" />
      <path d="M24 14c-3-2-4-6-2-9 3 2 4 6 2 9Z" />
      <path d="M24 22c-6 0-10-4-11-9 6 0 10 4 11 9Z" />
      <path d="M24 22c6 0 10-4 11-9-6 0-10 4-11 9Z" />
      <path d="M24 32c-6 0-10-4-11-9 6 0 10 4 11 9Z" />
      <path d="M24 32c6 0 10-4 11-9-6 0-10 4-11 9Z" />
    </SvgIcon>
  )
}

export {
  SoinBranchIcon,
  SoinCrystalIcon,
  SoinHeartIcon,
  SoinLotusIcon,
  SoinMoonIcon,
  SoinSpiralIcon,
}
