// Brand resolver (CommonJS) — shared by build scripts and electron-builder
// config. Reads the BRAND env var (default "lex"), loads branding/<brand>.json,
// and returns the brand object. This runs in Node at build time only.

const fs = require('node:fs')
const path = require('node:path')

const BRANDING_DIR = __dirname
const DEFAULT_BRAND = 'lex'

const REQUIRED_TOP_LEVEL = [
  'id',
  'productName',
  'companyName',
  'appId',
  'executableName',
  'tagline',
  'urls',
  'theme',
  'assets'
]

/**
 * Resolve the active brand.
 * @param {string} [brandId] Override; defaults to process.env.BRAND or "lex".
 * @returns {import('./types').Brand}
 */
function resolveBrand(brandId) {
  const id = (brandId || process.env.BRAND || DEFAULT_BRAND).trim()
  const file = path.join(BRANDING_DIR, `${id}.json`)

  if (!fs.existsSync(file)) {
    const available = fs
      .readdirSync(BRANDING_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace(/\.json$/, ''))
      .join(', ')
    throw new Error(
      `[branding] Unknown brand "${id}". Missing ${file}.\n` +
        `Available brands: ${available || '(none)'}.\n` +
        `Create one by copying branding/lex.json to branding/${id}.json.`
    )
  }

  let brand
  try {
    brand = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (err) {
    throw new Error(`[branding] ${file} is not valid JSON: ${err.message}`)
  }

  const missing = REQUIRED_TOP_LEVEL.filter(k => brand[k] === undefined)
  if (missing.length) {
    throw new Error(`[branding] ${file} is missing required field(s): ${missing.join(', ')}`)
  }

  if (brand.id !== id) {
    throw new Error(`[branding] ${file} has id "${brand.id}" but filename implies "${id}". Keep them in sync.`)
  }

  warnPlaceholders(brand, id)
  return brand
}

function warnPlaceholders(brand, id) {
  const json = JSON.stringify(brand)
  if (json.includes('CHANGEME')) {
    // eslint-disable-next-line no-console
    console.warn(
      `[branding] WARNING: brand "${id}" still contains CHANGEME placeholders ` +
        `(URLs/repo). Fix branding/${id}.json before shipping to a real client.`
    )
  }
}

module.exports = { resolveBrand, DEFAULT_BRAND, BRANDING_DIR }
