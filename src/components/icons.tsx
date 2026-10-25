import type { CSSProperties, ReactNode } from 'react'

// Small inline icon set (Lucide-style strokes), so the site needs no icon package.
type IconProps = { size?: number; className?: string; fill?: string; style?: CSSProperties }

function icon(paths: ReactNode) {
  return function Icon({ size = 24, className, fill = 'none', style }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        aria-hidden="true"
      >
        {paths}
      </svg>
    )
  }
}

export const ArrowDown = icon(<path d="M12 5v14M19 12l-7 7-7-7" />)
export const ArrowLeft = icon(<path d="M19 12H5M12 19l-7-7 7-7" />)
export const ArrowRight = icon(<path d="M5 12h14M12 5l7 7-7 7" />)
export const ChevronLeft = icon(<path d="m15 18-6-6 6-6" />)
export const ChevronRight = icon(<path d="m9 18 6-6-6-6" />)
export const Check = icon(<path d="M20 6 9 17l-5-5" />)
export const CheckCircle2 = icon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </>,
)
export const Plus = icon(<path d="M5 12h14M12 5v14" />)
export const Minus = icon(<path d="M5 12h14" />)
export const X = icon(<path d="M18 6 6 18M6 6l12 12" />)
export const Menu = icon(<path d="M4 6h16M4 12h16M4 18h16" />)
export const Search = icon(
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </>,
)
export const Send = icon(<path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />)
export const MessageCircle = icon(<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />)
export const Clock = icon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>,
)
export const Eye = icon(
  <>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </>,
)
export const Maximize = icon(<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />)
export const Users = icon(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
  </>,
)
export const BedDouble = icon(
  <>
    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M12 4v6M2 18h20" />
  </>,
)
export const Star = icon(<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1z" />)
