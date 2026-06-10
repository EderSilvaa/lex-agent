// Teste isolado do gateway WebSocket do backend (sem o app Electron no meio).
// Espera receber o frame gateway.ready em até 15s.
const TOKEN = 'LexTesteWs2026'
const url = `ws://127.0.0.1:9120/api/ws?token=${encodeURIComponent(TOKEN)}`
const t0 = Date.now()
const stamp = () => `+${Date.now() - t0}ms`

console.log('conectando em', url)
const ws = new WebSocket(url)

const die = setTimeout(() => {
  console.log(stamp(), 'TIMEOUT: nenhum frame em 15s')
  process.exit(2)
}, 15_000)

ws.addEventListener('open', () => console.log(stamp(), 'OPEN (upgrade aceito)'))
ws.addEventListener('message', e => {
  const text = typeof e.data === 'string' ? e.data : String(e.data)
  console.log(stamp(), 'MESSAGE:', text.slice(0, 200))
  if (text.includes('gateway.ready')) {
    console.log(stamp(), '✅ SUCESSO: gateway.ready recebido')
    clearTimeout(die)
    ws.close()
    process.exit(0)
  }
})
ws.addEventListener('close', e => console.log(stamp(), `CLOSE code=${e.code} reason=${e.reason || '(vazio)'}`))
ws.addEventListener('error', e => console.log(stamp(), 'ERROR:', e?.message || e?.error || 'sem detalhe'))
