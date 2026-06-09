# Lex (fork do Hermes Agent) — Handoff para continuar em casa

> Estado do trabalho de white-label + por que o app trava no boot e como resolver.
> Leia isto primeiro ao retomar (você ou outra IA). Data: 2026-06-09.

## TL;DR
- Fork do monorepo `NousResearch/hermes-agent` rebrandeado para **Lex** (white-label build-por-cliente).
- **Compila e roda**: o app abre, a UI aparece **brandada "Lex"** (título da janela, telas, i18n). ✅
- **Bloqueio atual:** o app trava no boot em ~90–94%. **Causa raiz descoberta:** o backend (`hermes dashboard`) **builda o web UI no startup (~2min)**, mas o desktop só espera **45s** (`waitForHermes`) → timeout → retry → spawn de vários backends → corrida de portas (`ECONNREFUSED 127.0.0.1:9120`).
- **Workaround que FUNCIONA:** subir o backend manualmente (deixar buildar/esquentar até `/api/status`=200) e abrir o desktop em **modo remoto** apontando pra ele.

---

## O que já foi feito (white-label) — tudo commitado
Arquitetura: marca centralizada em `apps/desktop/branding/` (fonte única). Build por cliente: `BRAND=<x> npm run dist:win`. Ver `apps/desktop/branding/README.md`.

Arquivos criados:
- `apps/desktop/branding/{types.ts, brand.cjs, lex.json, README.md}`
- `apps/desktop/scripts/gen-branding.cjs` (gera `src/branding.generated.ts` + `electron/branding.generated.cjs`, git-ignored)
- `apps/desktop/electron-builder.config.cjs` (config do packaging parametrizada por marca)
- `apps/desktop/src/branding.ts`
- `apps/desktop/.gitignore`

Arquivos editados (rebrand): `package.json` (name/productName/scripts), `electron/main.cjs` (APP_NAME/títulos/copyright via BRAND), `electron/bootstrap-runner.cjs` (URL do repo via BRAND), `electron/../scripts/set-exe-identity.cjs` (identidade do .exe), `src/app/settings/about-settings.tsx`, `src/components/{brand-mark,desktop-onboarding-overlay}.tsx`, `src/i18n/catalog.ts` (transform "Hermes"→"Lex"), `index.html` + `vite.config.ts` (título da janela).

**Decisão de design:** NÃO renomear encanamento interno (`HERMES_HOME`, IPC `hermes:`, header `X-Hermes-Session-Token`, `window.hermesDesktop`) — é o contrato com o backend.

## Pendências de marca (tasks abertas)
- **#7** Rebrandar ~40 mensagens de boot/erro visíveis no `main.cjs` ("Starting Hermes backend") — ainda dizem "Hermes" (não passam pelo i18n).
- **#8** Decidir destino do provedor "Nous Portal" (`src/app/settings/constants.ts` + onboarding) — integração real, não só marca.
- **Assets visuais**: trocar `apps/desktop/public/hermes-*` (sprite/frames/png) e `apps/desktop/assets/icon.*` + `branding/lex.json:assets.logo` (hoje aponta pra `nous-girl.jpg`).
- **URLs CHANGEME** em `branding/lex.json` (principalmente `urls.bootstrapRepoRaw` → SEU fork do cérebro).

---

## ⚠️ Causa-raiz do travamento no boot (o bug a resolver)
1. `apps/desktop/electron/main.cjs` → `waitForHermes()` tem `const deadline = Date.now() + 45_000` (45s).
2. O backend `hermes dashboard` na 1ª execução roda `npm run build` do pacote `web/` (tsc + vite, **~2min**, "Web UI built").
3. 45s < 2min → o desktop acha que o backend morreu → faz retry/pool → spawna vários backends → colidem em portas (Errno 10048) → `ECONNREFUSED 9120`, nunca estabiliza.

### Opções de correção (escolher 1+):
- **(A) Aumentar o timeout** em `main.cjs` `waitForHermes` de 45_000 para ex. `300_000` (5min), e investigar/desligar o pool de retries (`HERMES_DESKTOP_POOL_MAX=1`). Mais simples.
- **(B) Pré-buildar o web UI** uma vez (rodar `hermes dashboard` e deixar terminar; o `web/dist` fica em cache → próximos starts rápidos). Depois o 45s basta.
- **(C) Modo remoto (workaround comprovado):** subir backend à parte e conectar (ver abaixo).

---

## ✅ Workaround comprovado (abrir o app já): modo remoto
1. **Suba o backend manualmente** (deixe buildar o web UI ~2min até `/api/status`=200):
   ```bash
   cd <repo>            # ex.: ~/Downloads/teste/hermes-fork ou onde clonar
   export HERMES_HOME="<sua %LOCALAPPDATA%\hermes>"   # onde fica .env/config.yaml
   export HERMES_DASHBOARD_SESSION_TOKEN="um-token-qualquer"
   venv/Scripts/hermes.exe dashboard --no-open --host 127.0.0.1 --port 9120
   ```
   Espere ver `Web UI built` / `Hermes Web UI → http://127.0.0.1:9120`. Confirme:
   `curl -H "X-Hermes-Session-Token: um-token-qualquer" http://127.0.0.1:9120/api/status` → 200.
2. **Abra o desktop em modo remoto** (não spawna backend):
   ```powershell
   $env:HERMES_DESKTOP_REMOTE_URL  = "http://127.0.0.1:9120"
   $env:HERMES_DESKTOP_REMOTE_TOKEN = "um-token-qualquer"
   & "<repo>\node_modules\electron\dist\electron.exe" .   # rodar de dentro de apps/desktop
   ```
   (Refs no código: `main.cjs` linhas ~4095 (remote env) e web_server.py:183 (`HERMES_DASHBOARD_SESSION_TOKEN`).)

---

## Setup para retomar em casa (passo a passo)
1. `git clone <seu-repo-no-github> lex && cd lex`
2. `git config core.longpaths true` (Windows — senão o checkout falha em arquivos longos)
3. **Backend (Python):** instalar `uv`, depois:
   ```bash
   uv venv venv --python 3.11
   uv pip install --python venv/Scripts/python.exe -e .
   uv pip install --python venv/Scripts/python.exe python-multipart   # dep que faltava
   ```
4. **Desktop (Node):** `npm install` na RAIZ (monorepo workspaces).
5. **Electron binário (gotcha!):** a extração do binário às vezes deixa `node_modules/electron/dist` incompleto e `node_modules/electron/path.txt` vazio → erro "Electron failed to install correctly". Corrigir:
   - extrair o zip do cache `%LOCALAPPDATA%\electron\Cache\electron-v<ver>-win32-x64.zip` para `node_modules/electron/dist/`
   - escrever `electron.exe` em `node_modules/electron/path.txt`
6. **Config/API:** o `.env` (em `HERMES_HOME`) precisa de `ANTHROPIC_API_KEY=...` (provedor escolhido: Anthropic). Modelo: deixar o agente escolher o default ou setar em `config.yaml`.
7. Rodar: `cd apps/desktop && npm run build` (compila); para abrir, ver modo remoto acima OU `npm run dev` (renderer ao vivo).

## Gotchas observados nesta máquina
- **Rede MUITO lenta** pra npm/PyPI/GitHub aqui (npm install levou ~1h). Em casa deve ser rápido.
- **AppData virtualizado**: instalações feitas por ferramentas "sandboxed" foram parar em `...\Packages\Claude_*\LocalCache\Local\hermes` em vez do caminho real — confunde o resolve do backend. Em casa, instalando normalmente, não ocorre.
- `core.longpaths true` é obrigatório no Windows (arquivos de tradução zh-Hans com caminho longo).

## Como subir no GitHub (resumo — comandos completos no chat)
Só os 16 arquivos de source serão enviados (`node_modules`/`venv`/`dist` já no .gitignore).
1. Criar repo vazio no GitHub (web ou `gh repo create`).
2. `git remote add origin https://github.com/<voce>/lex.git`
3. `git add -A && git commit -m "white-label Lex + handoff"`
4. `git push -u origin <branch>`
(O remote `upstream` = NousResearch já está configurado pra puxar updates futuros.)
