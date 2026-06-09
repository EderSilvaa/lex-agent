import { BRAND } from '@/branding'
import { cn } from '@/lib/utils'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

// Brand badge: the active brand's logo on a white tile, identical in
// light/dark. Fills the tile (softly rounded); size via className (default
// size-14). Logo file comes from BRAND.assets.logo (public/<file>).
export function BrandMark({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white',
        className
      )}
      {...props}
    >
      <img alt={BRAND.productName} className="size-full object-contain" src={assetPath(BRAND.assets.logo)} />
    </span>
  )
}
