# Lex — Backlog de produto

Backlog vivo do Lex (fork white-label do Hermes Agent, voltado ao Direito).
Itens em ordem aproximada de prioridade. Ver também `HANDOFF-LEX.md` (estado técnico).

---

## ⭐ Features jurídicas (o valor do produto)

### 1. Lex Adversário (sparring adversarial) — FLAGSHIP
O advogado cria algo (petição, tese, contrato) e um agente **atacante** tenta rebatê-lo,
pra fortalecer **antes** que o adversário real o faça. Versão ética/construtiva de red-team
(oposto do `godmode` removido). Forte como demo, treino de júnior e marketing.

**Vetores de ataque que o adversário avalia:**
- Mérito — teses contrárias, contra-argumentos mais fortes
- Processual — vícios, preliminares, prescrição/decadência, ilegitimidade, competência
- Probatório — provas frágeis, ônus mal distribuído, o que falta juntar
- Jurisprudencial — precedentes/súmulas contra (e como distinguir)
- Retórico — o que um juiz cético atacaria

Para cada ataque → **"defesa sugerida"** (como blindar). Destruir E ensinar a consertar.

**Roadmap:**
- **v0** — skill `lex-adversario` (SKILL.md + persona do adversário): cola a peça → ataque estruturado + defesa sugerida. *Esforço baixo; é o primeiro tijolo jurídico.*
- **v1** — duelo por turnos: 2 personas (conselho × adversário) trocando golpes via toolset de delegation/subagentes.
- **v2** — gamificado: placar de "robustez da tese", pontos fracos no painel de preview.

Infra reaproveitada: delegation/subagentes, profiles (personas), padrão simulador (turnos). Sem código pesado novo no v0.

### 2. Monitor de publicações (dor real do FFV)
Skill modelada como automation template: `cron` verifica a fonte de publicações N×/dia →
classifica/casa com a carteira → calcula prazo → entrega no WhatsApp/e-mail do responsável.
Depende de mapear o fluxo de publicações do FFV (fonte/volume/triagem). Motor já existe (toolset `cronjob` + `messaging`).

### 3. Lex Simulador (treino gamificado)
Padrão "Claude Plays Pokémon" aplicado ao Direito: simulador de audiência/júri, treinador OAB,
negociação, "caso do dia". Turnos no chat + painel de estado. Treino + marketing viral.
(O Lex Adversário é a primeira encarnação desse padrão.)

### 4. Outras skills jurídicas (depois das primeiras)
- `calculo-prazos` (CPC/CLT + feriados forenses)
- `minuta-pecas` (modelos do escritório)
- `pesquisa-jurisprudencia` (web/browser + citação verificável)
- `resumo-processo` / `relatorio-cliente`
- Jurimetria (reusar `jupyter-live-kernel` vestido de jurídico)

---

## 🧹 Curadoria (posicionamento: profundidade, não largura)
- Definir o conjunto de skills/toolsets que o build Lex **mostra vs esconde vs remove**
  (inventário já feito: ~166 skills mapeadas em expor/adaptar/esconder).
- **Já removidas:** godmode, web-pentest, pokemon-player, minecraft-modpack-server.
- Promover as "gemas" (jurimetria, OSINT, whisper/transcrição, telephony, RAG, finance-models) com **roupa jurídica**.
- Criar **categorias jurídicas próprias** (contencioso, prazos, peças, pesquisa, cliente) no lugar de creative/devops/mlops.
- Curar **toolsets** (`toolsets.py`) — exige cuidado: validar cada remoção com build/import.

---

## 🎨 Marca / acabamento visual
- **Ícone do app** — já gerado (assets/lex/icon.ico/png via make-icon.cjs). ✔
- **Logo in-app** — SVG da Lex no brand mark. ✔
- Renomear/traduzir o tema **"Nous"** no Appearance + descrições de tema (presets.ts).
- Animação da logo (`LexMark` com stroke-draw/fade) — polimento.
- Cópia jurídica — reescrever frases de "repo/código/commits" para o contexto jurídico.

---

## 🔧 Técnico / pendências
- **#7** Rebrandar mensagens de boot/erro visíveis no `main.cjs` ("Starting Hermes backend", "Settings failed to load") — strings hardcoded fora do i18n.
- **#8** Decidir destino do provedor "Nous Portal" (constants.ts + onboarding) + remover login OAuth Claude (viola ToS).
- Preencher URLs `CHANGEME` em `branding/lex.json` (site, releases, **bootstrapRepoRaw → fork do cérebro**).
- Assinatura do `.exe` Windows (distribuir sem SmartScreen).
- Pinagem das deps do backend (starlette/uvicorn/websockets) — ver HANDOFF.

---

## 📋 Negócio (fora de código)
- Contrato de prestação de serviços com o FFV (escopo estreito + IP pré-existente da Lex).
- Registro INPI (programa de computador + marca; checar conflito "Lex"/LexisNexis).
- Modelo founding sponsor / panteão (FFV = fundador, não exclusivo).

---

## 🥊 Posicionamento competitivo (vs Gemini / NotebookLM)
Muito advogado já usa **Gemini / NotebookLM** pra transcrever e resumir → a demanda está
**validada** (não precisa educar o mercado sobre *se* serve). Mas essas são ferramentas de
consumidor, genéricas e **na nuvem**.

**A brecha (e a venda) = sigilo + LGPD.** Jogar áudio/petição do cliente no Gemini/NotebookLM
manda o dado pros servidores do Google → risco de quebra de **sigilo profissional (art. 7º EOAB)**
e tratamento indevido de dado pessoal/sensível (LGPD). A maioria faz sem perceber o risco.
Pitch do Lex: *"a mesma transcrição/análise, mas o dado do cliente nunca sai do escritório"* (whisper local).

| | Gemini / NotebookLM | Lex |
|---|---|---|
| Dado do cliente | Nuvem (Google) | **Local / fica no escritório** |
| Foco | Genérico | **Jurídico** (prazos, jurisprudência, adversário) |
| Natureza | Passivo (você pergunta) | **Agente** (monitora, redige, alerta, transcreve→extrai→aciona) |
| Marca | Google | **Do escritório** (white-label) |

Aprender com o NotebookLM: **Q&A ancorado com citação da fonte** (anti-alucinação — essencial
no Direito) e **audio overview** (→ "resumo falado do processo pro cliente"). O Lex não compete
como "mais um chat de IA" — compete sendo **local, jurídico, agêntico e do escritório**;
transcrição é a porta de entrada, o valor é o que vem depois (extrair, cruzar com o caso,
alertar prazo, atacar a tese).
