# Branding / White-label

This folder is the **single source of truth** for everything an end user can see
that identifies the product: name, company, app id, URLs, accent color and icons.
Each brand is one JSON file (`<brand>.json`) validated against
[`types.ts`](./types.ts).

The default/umbrella brand is **`lex.json`**.

## How it works

```
branding/<brand>.json        ← you edit this (source of truth)
        │  resolved by brand.cjs (reads BRAND env, default "lex")
        ▼
scripts/gen-branding.cjs      ← runs automatically on dev/build
        ├─ src/branding.generated.ts        → renderer (import { BRAND } from '@/branding')
        └─ electron/branding.generated.cjs  → electron main + bootstrap-runner
electron-builder.config.cjs   ← reads the brand for productName/appId/icon/NSIS
scripts/set-exe-identity.cjs  ← stamps brand name/company onto the Windows .exe
```

The generated files are **git-ignored** — they are rebuilt from the JSON every
time. Internal plumbing (`hermes:` IPC channels, `window.hermesDesktop`,
`HERMES_HOME`, the `@/hermes` API client) is intentionally **not** branded — it
is the contract with the agent backend and must stay stable.

## Create a brand for a new law office

1. **Copy the template**
   ```bash
   cp branding/lex.json branding/acme.json
   ```
2. **Edit `branding/acme.json`** — set `id` to `"acme"` (must match the filename),
   then `productName`, `companyName`, `appId` (e.g. `com.acme.app`),
   `executableName`, `tagline`, all `urls.*`, `theme.accent`, and `assets.*`.
   Remove every `CHANGEME` (the build warns if any remain).
3. **Drop in the icons** (replace, keep the filenames referenced in `assets`):
   - `assets/icon.ico` (Windows), `assets/icon.icns` (macOS), `assets/icon.png`
   - `public/<your-logo>` and point `assets.logo` at it (the in-app logo badge)
4. **Build the branded installer**
   ```bash
   BRAND=acme npm run dist:win      # Windows .exe + .msi
   BRAND=acme npm run dist:mac      # macOS .dmg + .zip
   BRAND=acme npm run dist:linux    # AppImage/deb/rpm
   ```
   Output lands in `release/` named `Acme-<version>-<os>-<arch>.<ext>`.

On Windows, `cross-env` is already a dependency, so this also works:
`npx cross-env BRAND=acme npm run dist:win`.

## What each field controls

| Field | Where the user sees it |
|---|---|
| `productName` | Window title, About screen, installer, all UI text (via i18n) |
| `companyName` | About attribution, Windows .exe CompanyName/Copyright |
| `appId` | OS app identity, installer, taskbar grouping |
| `executableName` | `.exe` / app bundle file name |
| `tagline` | Onboarding / About subtitle, Linux package synopsis |
| `urls.website` | "Learn more" / bring-your-own-endpoint docs link |
| `urls.releases` | About → "Release notes" link + update checks |
| `urls.bootstrapRepoRaw` | **First-launch installer source — point at YOUR agent ("brain") fork** |
| `urls.support` | Support/contact links |
| `urls.portal` | Hosted model portal link (Settings → Keys) |
| `theme.accent` | Primary accent color |
| `assets.icon*` | App/installer icons per OS |
| `assets.logo` | In-app logo badge (About / brand mark) |

## ⚠️ Still TODO before shipping a real brand

- Replace the **logo** (`assets.logo` currently points at the upstream image).
- Fill in real **URLs** (no `CHANGEME`).
- Point **`urls.bootstrapRepoRaw`** at your own agent/brain repo.
- The **MIT license** of the upstream project requires keeping its copyright
  notice somewhere in the distribution (e.g. a "Third-party licenses" screen).
  Rebranding the UI is fine; removing that notice entirely is not.
- Windows `.exe` is unsigned by default (SmartScreen warning). Configure code
  signing in your release pipeline before distributing.
