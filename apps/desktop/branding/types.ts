// Central white-label brand shape.
//
// This is the SINGLE SOURCE OF TRUTH for everything the end user can see that
// would otherwise reveal the upstream origin: product name, company, app id,
// URLs, accent colors and icon asset paths.
//
// To create a new white-label brand for a law office, copy `lex.json` to
// `<office>.json`, override the fields, drop in the icons, and build with
// `BRAND=<office> npm run dist:win`. See ./README.md.
//
// Internal plumbing (the `hermes:` IPC channels, `window.hermesDesktop`,
// `HERMES_HOME`, the `@/hermes` API client) is intentionally NOT part of the
// brand — it is the contract with the agent backend and must stay stable.

export interface BrandUrls {
  /** Public marketing site for the product. */
  website: string
  /** Where "Contact / Support" links point. */
  support: string
  /** Base URL the in-app updater / About page links to for releases. */
  releases: string
  /**
   * Raw base URL of the agent ("brain") repo used by the first-launch
   * bootstrap (install.ps1 / install.sh). Was NousResearch/hermes-agent.
   * Point this at YOUR brain fork.
   */
  bootstrapRepoRaw: string
  /** Hosted model portal shown in Settings → Keys (was portal.nousresearch.com). */
  portal: string
}

export interface BrandTheme {
  /** Primary accent color (hex). Drives buttons/links/highlights. */
  accent: string
  /** Optional dark-mode accent override; falls back to `accent`. */
  accentDark?: string
}

export interface BrandAssets {
  /** Windows icon, relative to apps/desktop. */
  iconIco: string
  /** macOS icon, relative to apps/desktop. */
  iconIcns: string
  /** Generic PNG icon, relative to apps/desktop. */
  iconPng: string
  /**
   * In-app logo shown in the About screen / brand badge. Path is relative to
   * the Vite public/ dir (e.g. "lex-logo.png" → apps/desktop/public/lex-logo.png).
   * REPLACE THIS per brand — it is the most visible logo in the UI.
   */
  logo: string
}

export interface Brand {
  /** Stable identifier, matches the json filename (e.g. "lex"). */
  id: string
  /** User-facing product name shown in UI, title bar, installer. */
  productName: string
  /** Legal/company name used in About + license attribution lines. */
  companyName: string
  /** Reverse-DNS app id for packaging (e.g. com.lex.app). */
  appId: string
  /** Installer/exe base name. Usually equals productName (no spaces is safest). */
  executableName: string
  /** One-line tagline for onboarding / About. */
  tagline: string
  urls: BrandUrls
  theme: BrandTheme
  assets: BrandAssets
}
