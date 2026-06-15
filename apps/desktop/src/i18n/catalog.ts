import { BRAND } from '@/branding'

import { en } from './en'
import { ja } from './ja'
import { ptBr } from './pt-br'
import type { Locale, Translations } from './types'
import { zh } from './zh'
import { zhHant } from './zh-hant'

// White-label: replace upstream brand tokens with the active brand at load
// time, so we never have to fork every translation string. "Nous Research" is
// replaced before "Hermes" so the company name wins on overlapping matches.
function brandText(value: string): string {
  return value.replaceAll('Nous Research', BRAND.companyName).replaceAll('Hermes', BRAND.productName)
}

// Deep-map a translations tree: rewrite string leaves, and wrap function leaves
// (interpolating translations) so their string output is rebranded too.
function deepBrand<T>(value: T): T {
  if (typeof value === 'string') {
    return brandText(value) as unknown as T
  }

  if (typeof value === 'function') {
    const fn = value as unknown as (...args: unknown[]) => unknown
    return ((...args: unknown[]) => {
      const out = fn(...args)
      return typeof out === 'string' ? brandText(out) : out
    }) as unknown as T
  }

  if (Array.isArray(value)) {
    return value.map(item => deepBrand(item)) as unknown as T
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) {
      result[key] = deepBrand(item)
    }
    return result as unknown as T
  }

  return value
}

export const TRANSLATIONS: Record<Locale, Translations> = {
  en: deepBrand(en),
  zh: deepBrand(zh),
  'zh-hant': deepBrand(zhHant),
  ja: deepBrand(ja),
  'pt-br': deepBrand(ptBr)
}
