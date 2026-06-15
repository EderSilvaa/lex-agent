// One-off: rasterize the Lex SVG logo to a 256x256 PNG via Electron's Chromium,
// then assemble a PNG-in-ICO. No external tools needed. Run with:
//   node_modules/electron/dist/electron.exe make-icon.cjs
const { app, BrowserWindow } = require('electron')
const fs = require('node:fs')
const path = require('node:path')

const SVG = fs.readFileSync(path.join(__dirname, 'apps/desktop/public/lex-logo.svg'), 'utf8')
const svgB64 = Buffer.from(SVG).toString('base64')
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;width:256px;height:256px;background:#08080C;overflow:hidden}
  .wrap{width:256px;height:256px;display:flex;align-items:center;justify-content:center}
  img{width:188px;height:188px;display:block}
</style></head><body><div class="wrap">
  <img src="data:image/svg+xml;base64,${svgB64}">
</div></body></html>`

app.disableHardwareAcceleration()
app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 256,
    height: 256,
    show: false,
    frame: false,
    backgroundColor: '#08080C',
    useContentSize: true,
    webPreferences: { offscreen: true }
  })
  await win.loadURL('data:text/html;base64,' + Buffer.from(html).toString('base64'))
  await new Promise(r => setTimeout(r, 800))
  let img = await win.webContents.capturePage()
  img = img.resize({ width: 256, height: 256, quality: 'best' })
  const png = img.toPNG()

  const outDir = path.join(__dirname, 'apps/desktop/assets/lex')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'icon.png'), png)

  // PNG-in-ICO (Vista+). Single 256x256 entry (width/height byte 0 == 256).
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(1, 4) // count
  const entry = Buffer.alloc(16)
  entry[0] = 0 // width 256
  entry[1] = 0 // height 256
  entry[2] = 0 // palette
  entry[3] = 0 // reserved
  entry.writeUInt16LE(1, 4) // planes
  entry.writeUInt16LE(32, 6) // bpp
  entry.writeUInt32LE(png.length, 8)
  entry.writeUInt32LE(22, 12) // offset = 6 + 16
  fs.writeFileSync(path.join(outDir, 'icon.ico'), Buffer.concat([header, entry, png]))

  console.log(`OK png=${png.length}B ico=${22 + png.length}B (${img.getSize().width}x${img.getSize().height})`)
  app.quit()
}).catch(e => {
  console.error('FAIL', e)
  app.exit(1)
})
