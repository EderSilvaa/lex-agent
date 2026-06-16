import { cn } from '@/lib/utils'

// Animated Lex mark: the triangle logo with its plumb line + bob swinging like
// a pendulum, plus a trailing afterimage (ghost copies that lag the front
// group) for a sense of motion. Used as the brand's loading animation (see
// the Loader wrapper in components/ui/loader.tsx) so waits feel alive.
//
// Pivot: each pendulum group rotates about its bounding-box top-center, which
// is the triangle apex (30,4) — so the line swings from the top like a real
// plumb line. CSS animation (not SMIL) so prefers-reduced-motion can freeze it.
//
// Sized by `className` (e.g. "size-full" / "size-12"); the viewBox scales the
// geometry to fit. Geometry + colors are Lex-specific (matches
// public/lex-logo.svg) — gate its use behind BRAND.assets.animatedBootMark.

const STYLE = `
@keyframes lexmark-swing{0%{transform:rotate(13deg)}50%{transform:rotate(-13deg)}100%{transform:rotate(13deg)}}
.lexmark-pend{transform-box:fill-box;transform-origin:top center;animation:lexmark-swing 2.8s cubic-bezier(.45,0,.55,1) infinite}
@media (prefers-reduced-motion:reduce){.lexmark-pend{animation:none;transform:none}.lexmark-ghost{display:none}}
`

// Ghosts lag the front group (positive animation-delay → trailing afterimage).
const GHOSTS = [
  { delay: '0.21s', opacity: 0.1 },
  { delay: '0.14s', opacity: 0.22 },
  { delay: '0.07s', opacity: 0.4 },
]

function Pendulum() {
  return (
    <>
      <line x1="30" y1="4" x2="30" y2="56" stroke="#08080C" strokeWidth="4" strokeLinecap="round" />
      <circle cx="30" cy="56" r="4" fill="#08080C" />
    </>
  )
}

export function LexMark({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 60 62"
      role="img"
      aria-label="Lex"
      className={cn('shrink-0', className)}
      {...props}
    >
      <style>{STYLE}</style>
      <rect width="60" height="62" rx="11" fill="#08080C" />
      <polygon points="30,4 54,56 6,56" fill="#FFFFFF" />
      {GHOSTS.map((g) => (
        <g key={g.delay} className="lexmark-pend lexmark-ghost" style={{ opacity: g.opacity, animationDelay: g.delay }}>
          <Pendulum />
        </g>
      ))}
      <g className="lexmark-pend">
        <Pendulum />
      </g>
    </svg>
  )
}
