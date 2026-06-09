// electron-builder configuration, parametrized by the active brand.
//
// Used via `electron-builder --config electron-builder.config.cjs` (see the
// `builder` script in package.json). The brand is selected by the BRAND env
// var (default "lex") and resolved from branding/<BRAND>.json.
//
// White-label a new office:  BRAND=acme npm run dist:win
// (after creating branding/acme.json and its icon files — see branding/README.md)

const { resolveBrand } = require('./branding/brand.cjs')

const brand = resolveBrand()

/** @type {import('electron-builder').Configuration} */
module.exports = {
  electronVersion: '40.9.3',
  appId: brand.appId,
  productName: brand.productName,
  executableName: brand.executableName,
  artifactName: brand.executableName + '-${version}-${os}-${arch}.${ext}',
  icon: 'assets/icon',
  directories: {
    output: 'release'
  },
  files: ['dist/**', 'assets/**', 'electron/**', 'public/**', 'package.json'],
  beforeBuild: 'scripts/before-build.cjs',
  beforePack: 'scripts/before-pack.cjs',
  afterPack: 'scripts/after-pack.cjs',
  extraResources: [
    { from: 'build/install-stamp.json', to: 'install-stamp.json' },
    { from: 'build/native-deps', to: 'native-deps' },
    { from: brand.assets.iconIco, to: 'icon.ico' }
  ],
  asar: true,
  afterSign: 'scripts/notarize.cjs',
  asarUnpack: ['**/*.node', '**/prebuilds/**', 'dist/**'],
  mac: {
    category: 'public.app-category.productivity',
    icon: brand.assets.iconIcns,
    entitlements: 'electron/entitlements.mac.plist',
    entitlementsInherit: 'electron/entitlements.mac.inherit.plist',
    extendInfo: {
      CFBundleDisplayName: brand.productName,
      CFBundleExecutable: brand.executableName,
      CFBundleName: brand.productName,
      NSAudioCaptureUsageDescription: `${brand.productName} uses audio capture for voice conversations.`,
      NSMicrophoneUsageDescription: `${brand.productName} uses the microphone for voice input and voice conversations.`
    },
    gatekeeperAssess: false,
    hardenedRuntime: true,
    target: ['dmg', 'zip']
  },
  dmg: {
    title: `Install ${brand.productName}`,
    backgroundColor: '#f5f5f7',
    iconSize: 96,
    window: { width: 560, height: 360 },
    contents: [
      { x: 160, y: 170, type: 'file' },
      { x: 400, y: 170, type: 'link', path: '/Applications' }
    ]
  },
  win: {
    icon: brand.assets.iconIco,
    legalTrademarks: brand.productName,
    target: ['nsis', 'msi'],
    signAndEditExecutable: false
  },
  linux: {
    icon: brand.assets.iconPng,
    category: 'Office',
    maintainer: brand.companyName,
    synopsis: brand.tagline,
    target: ['AppImage', 'deb', 'rpm']
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: false,
    shortcutName: brand.productName,
    uninstallDisplayName: brand.productName,
    warningsAsErrors: false
  }
}
