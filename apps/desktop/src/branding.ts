// Public entry point for brand values in the renderer. Import from here:
//
//   import { BRAND } from '@/branding'
//   <span>{BRAND.productName}</span>
//
// The actual values live in `branding.generated.ts`, produced at build time
// from branding/<BRAND>.json by scripts/gen-branding.cjs.

export type { Brand } from '../branding/types'
export { BRAND } from './branding.generated'
