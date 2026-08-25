---
name: verify-visual
description: Verifica no navegador (Playwright) uma tela da "Nossa Grana" — renderização fiel nos DOIS temas (claro/escuro, design tokens/fontes/sem RarUI) E fluxos com dados reais (criar/editar/filtrar), logando sozinha via POST /auth/login (sem pedir token ao usuário). Use após migrar uma página para shadcn, após adicionar um componente shadcn, ao validar um filtro/CRUD contra a API real, ou quando o usuário pedir "conferir no claro e escuro", "validar visual", "checar o tema", "testar no navegador".
---

# verify-visual

Confirma que uma tela está com a cara certa na nova identidade, nos dois temas, antes de dar como
pronta. É uma checagem visual/comportamental — complementa (não substitui) `yarn build` e
`yarn lint`.

## Rodar o app

- **yarn 4 apenas.** Dev server: `yarn dev` (mode `dev`) — sobe em **http://localhost:3000**.
  Use `yarn loc` para o ambiente local se for esse o alvo da mudança. Suba em background e navegue
  até a rota-alvo. Se existir uma skill `run` do projeto, prefira ela.
- Se a porta 3000 já responde (`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`),
  reutilize — não suba outro server.

## Autenticação — dois caminhos

O app exige login Google e protege as rotas. Não dá pra fazer o OAuth pelo Playwright. Escolha
conforme o que está validando:

### A) Só layout/tema/render → `VITE_SKIP_AUTH`

Se a checagem é sobre **aparência** (tokens, tema, fontes, responsivo) e não depende de dados reais,
ligue o bypass: no `.env.dev`, `VITE_SKIP_AUTH=false` → `true` e reinicie o dev server. Isso injeta
um usuário fake e libera as rotas privadas sem login (ver `proxy-route.tsx`). **Lembre de voltar
para `false`** ao terminar. Atenção: o token é fake (`"dev-skip-auth"`), então chamadas à API real
falham (401/500) — serve para telas com dados mockados/vazios, não para validar dados de verdade.

### B) Fluxo com dados reais (criar/editar/filtrar) → login automático + injetar JWT

Quando precisa que a API responda de verdade, **obtenha o token você mesmo** via login por
senha (`POST /auth/login`) e injete no localStorage. **Não peça token ao usuário.**

Pré-requisito: o back tem que estar de pé **contra o banco de dev** e o front tem que apontar pra
ele. O jeito mais simples é `yarn loc` no front (aponta pra `http://localhost:3001`) + back na
`3001` (`cp .env.development .env && PORT=3001 yarn start:dev` no `financas-api`). Confira a API que
o front usa em `.env.loc`/`.env.dev` (`VITE_API_URL`) e case a porta do back.

1. **Pegue o JWT** batendo direto na API. As credenciais do usuário de teste do dev vêm do
   `.env.development` do back (`TEST_USER_EMAIL` / `TEST_USER_PASSWORD`) — não hardcode:
   ```bash
   # do diretório do financas-api (as vars estão no .env.development de lá)
   set -a; . ../financas-api/.env.development; set +a
   curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" \
     -d "{\"email\":\"$TEST_USER_EMAIL\",\"password\":\"$TEST_USER_PASSWORD\"}"
   # → { "data": { "access_token": "<JWT>", "nome": "...", "email": "..." } }
   ```
   Extraia `data.access_token`. Se der 401, o usuário não existe/está sem senha nesse banco — aí sim
   avise o usuário (provável banco errado no `.env`, ou dev foi resetado — ver skill
   `clonar-prod-dev` no back).
2. O auth do front é um Zustand `persist`, chave **`auth`**, shape
   `{"state":{"auth":{"token","user"}},"version":0}` (ver `src/presentation/store/auth.ts`). O
   `user` é opcional, então um objeto mínimo basta.
3. **Injete e recarregue** (navegue pra qualquer rota primeiro pra ter `localStorage` do domínio):
   ```js
   // browser_evaluate — TOKEN vem do passo 1
   () => {
     localStorage.setItem(
       "auth",
       JSON.stringify({
         state: { auth: { token: "<JWT>", user: {} } },
         version: 0,
       }),
     );
     return "ok";
   };
   ```
   Depois `browser_navigate` para a rota-alvo. Se cair em `/login`, o token não pegou — refaça o
   passo 1 (o JWT expira em ~24h, então gere na hora, não reaproveite um antigo).

- Com `yarn loc`+back local, os requests batem no seu back → banco de **dev** (dados reais e
  seguros pra mexer). Com `yarn dev` apontando pra hml/prod, cuidado ao criar/editar/excluir.
- O `.mock` só gera tipos, não intercepta HTTP.

## Screenshots (Playwright)

- Tire com `browser_take_screenshot` salvando em **`.playwright-mcp/<nome>.png`** (relativo, dentro
  do projeto — fora dele o resize falha por sandbox).
- A API de leitura de imagem **rejeita > ~2000px**. Sempre reduza antes de ler:
  `sips -Z 1400 <arquivo>` (in-place; `Bash(sips:*)` já é pré-autorizado, não pede permissão).
- Para pegar refs de elementos use `browser_snapshot` (melhor que screenshot para agir). Refs
  (`f71e67`) mudam a cada navegação — recapture antes de clicar. Selectores CSS/role também servem:
  `button[role="combobox"]:has-text("Todos")`.
- **Digitar em campo cmdk/Command** (Combobox): use `browser_type` com `slowly: true` — o `fill`
  não dispara o `onValueChange` do cmdk. E dentro de Sheet/Dialog o Combobox precisa de `inline`
  (ver [[combobox-inline-overlay]]), senão o input nem foca.
- Ao terminar, **apague os PNGs temporários** que sobraram na raiz/`.playwright-mcp`.

## Alternância de tema

O tema é dirigido por `data-theme` (`"light"`/`"dark"`) + classe `.dark` na `<html>`, persistido em
`localStorage["dark-theme"]` (ver App.tsx). Para checar o escuro, alterne o controle de tema do app,
ou faça `localStorage["dark-theme"]="true"` e recarregue, ou no devtools rode
`document.documentElement.dataset.theme="dark"`.

## Checklist (nos dois temas)

- **Tokens resolvem**: fundos usam `bg`/`card`, texto usa `fg`/`fg2`/`muted`, bordas `line`; nada
  renderiza preto-puro/branco-puro onde um token deveria valer. Ações primárias são `#5B4BE0` com
  `shadow-primary`.
- **Fontes**: valores monetários, números grandes e títulos usam **Space Grotesk** (`font-display`,
  `tracking-tight`); corpo/rótulos usam **Outfit**. Se um valor parece a sans padrão, faltou a
  classe `font-display`.
- **Cores de categoria** passam por `enhance()` — legíveis e distintas nos DOIS temas (é a razão
  inteira de o enhance existir). Confira alguns chips/linhas de categoria especificamente no escuro.
- **Semântica**: receita verde (`success`), despesa/erro `danger`; âmbar para atrasado/duplicado;
  estrela para favorito.
- **Sem vazamento de RarUI**: a página migrada não tem import `@rarui`
  (`grep -rn "@rarui" src/presentation/pages/<Name>`) nem classe RarUI residual.
- **Responsivo**: em `< 900px` os modais viram bottom sheets e o layout aguenta (sem scroll
  horizontal no body).
- **Interações**: toasts aparecem (com **Desfazer** em ações destrutivas), foco/teclado funcionam
  (Radix), animações (`om-*`) tocam nas transições de modal/lista.

## Reporte

Diga o que você navegou, quais rotas/componentes, screenshots ou observações concretas por tema, e
qualquer desvio da spec do handoff. Reporte com honestidade — se o login falhou (401 no
`/auth/login`, back apontando pro banco errado) e você não conseguiu autenticar, diga isso em vez de
fingir que validou.
