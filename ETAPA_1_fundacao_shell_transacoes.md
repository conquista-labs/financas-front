# Etapa 1 — Fundação visual + Shell + Transações

> Stack alvo: **React 19 + TypeScript + Vite** (projeto `financas-front` existente) + **Tailwind CSS** + **shadcn/ui** (Radix). Substitui o RarUI. Fonte de tokens/telas: `README.md` e `API_REFERENCE.md` deste pacote; protótipo navegável em `Financas Repaginado.dc.html`.

## Objetivo da etapa

Estabelecer a nova fundação visual e entregar o fluxo mais usado (Transações) na nova cara, **sem depender de backend novo** — só endpoints já existentes.

---

## 1. Setup

```bash
# no financas-front
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn@latest init      # style: new-york; base color: neutral; CSS vars: yes
```

- Remover RarUI progressivamente (`@rarui-react/components`, `@rarui/icons`) conforme cada tela migra. Não precisa remover tudo de uma vez.
- `darkMode: ["class"]` (tema via classe/atributo na `<html>`).
- Fontes: adicionar no `index.html` o `<link>` do Google Fonts (Space Grotesk 400–700 + Outfit 300–700).

## 2. Tokens → `tailwind.config.ts` + CSS vars

`src/index.css` (ou `globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: 245 244 240; /* #F5F4F0 */
  --card: 255 255 255; /* #FFFFFF */
  --line: 233 231 225; /* #E9E7E1 */
  --line2: 242 240 234; /* #F2F0EA */
  --track: 240 238 232; /* #F0EEE8 */
  --fg: 23 22 27; /* #17161B */
  --fg2: 61 59 69; /* #3d3b45 */
  --muted: 151 147 160; /* #9793a0 */
  --primary: 91 75 224; /* #5B4BE0 */
  --primary-strong: 69 54 201; /* #4536c9 */
  --accent-soft: 238 235 251; /* #EEEBFB */
  --success: 18 166 106; /* #12A66A */
  --danger: 229 72 77; /* #E5484D */
  --warning: 183 110 0; /* #B76E00 */
  --star: 245 179 1; /* #F5B301 */
}
[data-theme="dark"],
.dark {
  --bg: 19 18 23; /* #131217 */
  --card: 28 27 34; /* #1c1b22 */
  --line: 44 43 51; /* #2c2b33 */
  --line2: 38 37 45;
  --track: 38 37 45;
  --fg: 245 244 240;
  --fg2: 184 181 192; /* #b8b5c0 */
  --muted: 130 128 140; /* #82808c */
  --accent-soft: 42 36 74; /* roxo escuro translúcido */
  /* primary/success/danger/warning/star mantêm o mesmo hex */
}
body {
  font-family: Outfit, sans-serif;
  color: rgb(var(--fg));
  background: rgb(var(--bg));
}
```

`tailwind.config.ts` (trecho `theme.extend`):

```ts
colors: {
  bg: "rgb(var(--bg) / <alpha-value>)",
  card: "rgb(var(--card) / <alpha-value>)",
  line: "rgb(var(--line) / <alpha-value>)",
  line2: "rgb(var(--line2) / <alpha-value>)",
  track: "rgb(var(--track) / <alpha-value>)",
  fg: "rgb(var(--fg) / <alpha-value>)",
  fg2: "rgb(var(--fg2) / <alpha-value>)",
  muted: "rgb(var(--muted) / <alpha-value>)",
  primary: { DEFAULT: "rgb(var(--primary) / <alpha-value>)", strong: "rgb(var(--primary-strong) / <alpha-value>)", soft: "rgb(var(--accent-soft) / <alpha-value>)" },
  success: "rgb(var(--success) / <alpha-value>)",
  danger: "rgb(var(--danger) / <alpha-value>)",
  warning: "rgb(var(--warning) / <alpha-value>)",
  star: "rgb(var(--star) / <alpha-value>)",
},
fontFamily: { sans: ["Outfit","sans-serif"], display: ["Space Grotesk","sans-serif"] },
borderRadius: { card: "20px", hero: "22px", btn: "13px", pill: "9999px" },
boxShadow: {
  primary: "0 10px 22px -12px rgb(91 75 224 / .9)",
  hero: "0 20px 40px -22px rgb(43 35 80 / .7)",
  modal: "0 20px 50px -12px rgb(0 0 0 / .4)",
},
keyframes: { /* fade, pop, rise, toast, spin, float — ver protótipo */ },
```

- **Números/valores monetários e títulos**: classe `font-display` (Space Grotesk) com `tracking-tight`.
- **Realce de cor de categoria** (`enhance`): portar a função do protótipo para `src/lib/color.ts` (HSL, satura ≥.55, luz 0.40–0.60). Usar na exibição; salvar o hex original.

## 3. Tema claro/escuro

- Hook `useTheme()` (context) que alterna atributo `data-theme` na `<html>` e persiste em `localStorage`.
- Toggle no shell (sidebar desktop + top bar mobile).

## 4. Componentes shadcn a instalar

`button, dialog, sheet (bottom sheet mobile), select, dropdown-menu, tabs, input, textarea, switch, checkbox, popover, tooltip, badge, sonner (toast), scroll-area, avatar, separator, skeleton`.

> Toasts com ação **Desfazer** → usar `sonner` (`toast(... , { action: { label: "Desfazer", onClick } })`).

## 5. Shell (layout raiz)

Componentes: `AppShell`, `Sidebar` (desktop), `MobileTopBar`, `MobileTabBar`, `QuickAddButton`.

- **Sidebar desktop**: sticky, 252px expandida / 76px recolhida (`transition-[width]`). O **botão do logo recolhe/expande** (`sidebarCollapsed` em context + localStorage). Itens: Visão geral, Transações, Calendário, Patrimônio, Cadastros, Importar. Item ativo: `bg-primary-soft text-primary`. Recolhida = só ícones + tooltip (shadcn `tooltip`). Rodapé: avatar + nome + **Sair**.
- **"Lançar"**: botão primário; recolhido vira circular com `+`.
- **Mobile**: top bar (título + tema + sair + seletor de mês) e bottom tab bar (Início, Extrato, FAB +, Agenda, Patri.). Modais viram `sheet` (bottom).
- Breakpoint mobile: `< 900px` (usar `lg` custom ou media query).

## 6. Tela Transações (fluxo principal)

### Endpoints

- Lista: `GET /transacoes` (query: `page, limit, search, startDate, endDate, categoriaId, pessoaId, pessoaIds[], meioPagamentoId, formaPagamento, tipo`).
- Opções de selects: `GET /enums`, `GET /categorias`, `GET /pessoas`, `GET /meios-pagamento`.
- Criar/editar/excluir: `POST /transacoes`, `PATCH/DELETE /transacoes/{id}`.
- Exportar: `GET /relatorios/transacoes` (mesmos filtros).
- Envelope: ler sempre `res.data`; lista paginada em `data.rows` + `data.meta` + `data.resume.total`.

### Data layer (React Query — já no projeto)

- `useTransacoes(filters)` → query com `keepPreviousData` para paginação.
- Mutations `useCreate/useUpdate/useDeleteTransacao` com `invalidateQueries(['transacoes'])` + toast (Desfazer no delete = re-`POST` do payload salvo, já que não há endpoint de restore).

### UI / estados

- **Barra**: busca sempre visível (debounce ~300ms; reset de `page` ao mudar busca/filtro), botão Filtros (badge de contagem), Importar, Nova.
- **Filtros** em `sheet`/`popover`: Tipo, Categoria, Pessoa, Meio, Forma, Período (De/Até), Tag\*. Chips ativos removíveis + "Limpar tudo".
- **Lista**: `scroll-area` com altura fixa (~560px) + **rodapé fixo** (Exportar CSV + Total do período). Linha: cor da categoria, descrição, meta (categoria·pessoa·forma·meio), badge de parcela (derivar de `formaPagamento=parcelaNx`), valor (verde se receita), data, ações Editar/Duplicar/Excluir.
- **Paginação**: "Mostrando X–Y de N" + seletor por página (20/50/100) + ‹ ›.
- **Lançamento rápido** (`dialog`/`sheet`): tipo, valor grande, categoria em chips (favoritas+mais usadas primeiro, "+ ver todas"), descrição, pessoa, data. Link "formulário completo".
- **Form completo**: Categoria, Pessoa, Meio, Forma, Data, Descrição, Valor, Observações, Repetição (Único/Mensal/Parcelar → `formaPagamento`), toggle "Lembrar-me" (`lembrarMe`). Ações Cancelar / Salvar e adicionar outra / Salvar.

\* **Tag** e **Favoritos** ainda não têm backend (ver "Gaps" no API_REFERENCE). Nesta etapa: Favoritos em `localStorage`; Tags — esconder o controle ou manter só client-side até a Etapa 3.1.

## 7. Definition of Done (Etapa 1)

> **Status em 2026-07-20:** Fundação + Shell (desktop/mobile) + Login + Transações (lista/filtros/lançamento rápido) concluídos e validados no browser com dados reais. Falta: form completo de transação, e as demais telas (Dashboard/Calendário/Patrimônio/Cadastros = Etapa 2). Migração progressiva; RarUI ainda convive nas telas não migradas.

- [~] **Tailwind + shadcn configurados; RarUI removido das telas migradas.** — Fundação ✅; remoção de RarUI pendente (0 telas migradas até agora).
  - [x] Tailwind v3 + PostCSS + `tailwind.config.ts` com tokens do guia (cores, fontes, raios, sombras, animações `om-*`).
  - [x] shadcn configurado (`components.json`) + ponte de tokens shadcn→nossos (bg/fg/primary...). Gerenciador é **yarn** (nunca npm).
  - [x] Primitivos base instalados em `components/ui/`: button, dialog, sheet, dropdown-menu, tooltip, avatar, separator (+ sonner→Toaster). Wrappers no padrão do projeto: Button/, Avatar/, Separator/, Toaster/.
  - [~] RarUI removido tela a tela: **Login e Transações** (lista) já 100% sem @rarui. Falta: form completo de transação, Home/Dashboard, Calendário, Patrimônio, Cadastros.
- [x] **Tokens claro/escuro aplicados; toggle de tema persistente.** — tokens dos 2 temas + `enhance()` de cor; App.tsx sincroniza `data-theme`/`.dark` na `<html>` e persiste em `localStorage["dark-theme"]`. (Controle visual do toggle entra com o Shell.)
- [~] **Shell completo (sidebar recolhível + mobile tab bar) navegável.** — Sidebar desktop ✅; mobile pendente.
  - [x] `AppShell` (compõe Sidebar + área de conteúdo max-w-1180) ligado no `private-route` no lugar do `Template` RarUI. Toaster (sonner) montado no App.
  - [x] Sidebar desktop recolhível 252/76px (logo recolhe/expande, estado em `useSidebar` + `localStorage["sidebar-collapsed"]`), nav com item ativo (bg-primary-soft/text-primary), tooltips quando recolhida, botão Lançar (placeholder), toggle de tema, bloco usuário + Sair (reusa `usePostLogoutGoogle` + `resetState`). Breakpoint `lg` custom = 900px.
  - [x] MobileTopBar (título da rota + tema + sair + mês placeholder) + MobileTabBar (Início/Extrato/Agenda/Patri. + FAB central "Lançar"). Visíveis só < 900px (lg:hidden). Validados no browser (Playwright) em viewport mobile, claro e escuro. Padrão cva em `Mobile/mobile.styles.ts`.
  - [x] QuickAddButton (FAB mobile) liga no modal de Lançamento Rápido.
  - [x] Botão "Lançar" (sidebar) liga no modal de Lançamento Rápido. Modal acessível de qualquer gatilho via `QuickAddProvider` (contexto global no AppShell).
- [x] **Login com Google na nova cara (`/auth/google-login`).** — Migrado 100% para shadcn/Tailwind (zero @rarui). Split 2 colunas: BrandPanel (foto banner.png + overlays + cards glass flutuantes com animação om-float + headline + chips) e LoginCard (wordmark + "Bem-vindos de volta! 👋" + botão Google 4-cores + selo privacidade). Responsivo (<860px painel some, só cartão). Lógica de auth (useGoogleLogin auth-code → usePostLoginWithGoogle → setAuth → navigate) preservada; toast agora via sonner. Validado no browser: desktop claro, mobile, desktop escuro.
- [x] **Transações: lista com filtros/busca/paginação/export, lançamento rápido e form completo, todos ligados à API real.** — ✅ tudo migrado; legados RarUI (Form/Filters/TableFooter) removidos.
  - [x] **Lista** ligada à API real (`useGetTransacoes`): linha com cor de categoria (`enhance()`), meta (categoria·pessoa·forma·meio), badge de parcela, tags, valor (verde=receita), data, ações editar/duplicar/excluir. Card de altura fixa + scroll interno via componente reutilizável **`ScrollListCard`** (usado tb em Cadastros/Importar). Skeleton + estado vazio.
  - [x] **Busca** (debounce 300ms, reset de página), **paginação** (20/25/50/100 via Select shadcn + navegação), **export** (relatório xlsx). Estado na URL (query params, deep-linkável).
  - [x] **Filtros avançados** (drawer shadcn Sheet): Tipo, Categoria (chips com scroll), Pessoa/Meio/Forma (Select shadcn), Período (2× `DateField` = Calendar+Popover). Chips de filtro ativos removíveis + "Limpar tudo" + badge de contagem.
  - [x] **Lançamento rápido** (modal Dialog): tipo (valor verde p/ receita), valor gigante, categoria (favoritas primeiro, chips com scroll + estrela), descrição, pessoa, data (`DateField`), repetição (único/mensal/parcelar), tags. POST real (omite IDs vazios — ver [[rebrand-gaps-backend]]) + link "abrir formulário completo".
  - [x] **Form completo (Create/Edit)** migrado de RarUI → shadcn (o modal linka pra ele). RHF+Yup, card grid 2 colunas fiel ao protótipo, tags com chips, switch "Lembrar-me", 3 ações (Cancelar/Salvar e adicionar outra [só no Create]/Salvar). Helpers `toRequest`/`fromTransacao`. Validado no browser: criar + editar reais.
  - **Componentes reutilizáveis novos**: `ScrollListCard`, `DateField`, **`Combobox`** (select com busca/typeahead — usado no form e no FiltersSheet; prop `inline` p/ funcionar dentro de Sheet, ver [[combobox-inline-overlay]]).
- [~] Responsivo (desktop + mobile) e acessível (foco/teclado via Radix). — Shell e telas migradas responsivos e com foco/teclado Radix (Sheet/Dialog/Select/Popover); falta validar telas ainda não migradas.

### Registro de progresso

- **2026-07-17** — Fundação visual: Tailwind + shadcn + tokens claro/escuro + tema na `<html>` + `enhance()`. Build validado.
- **2026-07-19/20** — Componentes shadcn base + ponte de tokens + wrappers no padrão do projeto (ui/ crus + Button/Avatar/Separator/Toaster). Build e lint (dos arquivos novos) OK.
- **Skills do projeto** criadas/atualizadas em `.claude/skills/` para apoiar o rebrand (migrate-page-to-shadcn, add-shadcn-component, verify-visual, new-domain-model, new-usecase, add-usecase-tests; new-page marcada como legada RarUI).
- **2026-07-20** — Shell (desktop Sidebar + mobile top/tab bar + FAB) e **Login** migrados. Fix global de borders (reset RarUI zerava border-style). Tokens ajustados p/ valores exatos do protótipo.
- **2026-07-20** — Tipos regenerados do swagger (novos: **tags** em transações + **favoritos** em categoria/pessoa/meio). Fluxo em [[fluxo-geracao-tipos]].
- **2026-07-20** — **Transações** completo: lista+busca+paginação+export (Fatia 1), filtros avançados + lançamento rápido (Fatia 2). Componentes reutilizáveis `ScrollListCard` e `DateField`. Selects → shadcn Select. Validado no browser com dados reais (API localhost:4000), 2 temas.
- **2026-07-21** — **Form completo (Create/Edit)** migrado p/ shadcn (RHF+Yup, `toRequest`/`fromTransacao`); legados RarUI de Transações removidos (Form/Filters/TableFooter). Novo componente **`Combobox`** (select com busca) aplicado no form e no FiltersSheet — fix `inline` p/ foco dentro do Sheet. Tipos regenerados (status/statusExibicao/pagaEm + recorrências + enums novos). Confirmado bug do back: `pessoaId:""` no POST → 500 (não virou null como prometido) → front omite IDs vazios. **Fecha o escopo funcional da Etapa 1.** Skill `verify-visual` expandida (auth por token/SKIP_AUTH, setup Playwright) + wildcard `sips` nas permissões.
  - [x] **Calendário** (2026-07-21) — tela reescrita p/ shadcn. Card único: título + sub-tabs (Lançamentos / Contas a pagar=placeholder Etapa 3), 4 KPIs do mês (receitas/despesas/saldo/maior gasto — calculados no front), grade mensal 7×N (heatmap de gasto vermelho por intensidade, número, net colorido, até 2 entradas com barrinha de categoria, "+N mais", destaque de hoje). Clicar num dia → `DayTransactionsDialog` (transações + total). Resumo por semana (barras). Reusa `MonthPicker`. **GAP DE UX resolvido no front**: a API `/transacoes/calendario` só retorna dias COM transação — geramos os dias vazios no `buildGrid` pra grade não ficar esparsa (só `totalDespesas` vem pronto; receitas/net calculados somando `transacoes` por tipo). Removidos RarUI órfãos: `components/Calendar`, `MiniCalendar`, `DailyTransactionsModal`. Validado (2 temas, navegação, modal).
  - [x] **Contas a pagar** (2026-07-21) — aba do Calendário. Lista transações pendentes/atrasadas (`GET /transacoes?status=pendente` + período do mês) com KPIs (a pagar / em atraso / pendentes), badge de status (statusExibicao: pendente âmbar / atrasada vermelho), e **marcar como paga** (checkbox → `POST /transacoes/{id}/pagar` → 201, some da lista). Filtro de mês próprio (MonthPicker). Empty state "Tudo em dia". **Criados no cliente** (não existiam): usecase/data/factory `PostTransacoesIdPagar` + campo `status` no `GetTransacoesParams`. Fluxo validado ao vivo (criei conta pendente → paguei → 201). Falta: Patrimônio.

## Próximas etapas (contexto)

- **Etapa 2**: Dashboard (`/resumo-financeiro` + `/analytics/*`), Calendário, Patrimônio, ~~Cadastros~~ — reusando os componentes desta etapa.
  - [x] **Cadastros** (2026-07-21) — hub `/cadastros` com 5 abas (Categorias/Pessoas/Meios funcionais; Recorrentes/Tags placeholder). Modal único (`RegisterFormDialog`) com campos condicionais + color picker (8 swatches+custom+prévia `enhance()`). Favorito via PATCH real. CRUD validado no browser (POST/PATCH/DELETE 200/201) nos 2 temas. Removidas telas RarUI antigas (Categories/Peoples/MeansOfPayment) + `Template`; hooks CRUD de cadastro reapontados p/ `registers`. Novos: `useRegisterMutations` (CRUD via factory, sem efeitos RarUI).
  - [x] **Dashboard (Home) — 2 abas completas** (2026-07-21) — Home reescrita p/ shadcn.
    - **Visão geral**: KpiCards (4 do QuickStats), BalanceHero (gradiente roxo/vermelho por sinal), YearTable (12 meses CSS grid + chips % + barra lateral + footer card2 arredondado), IncomeExpenseChart (**Recharts** BarChart empilhado, sem cursor), BudgetList (progress CSS), ExpenseDonut (**Recharts** Pie 196px + tooltip fora do centro), RecentTransactions (últimos 6).
    - **Análises**: TopCategoriasCard (variação + Teto% colorido), HealthCard (score/100 + 4 fatores ✓/✗), MeiosPagamentoCard (barras roxas), CategoryMatrix (categoria × 12 meses, 1ª coluna sticky).
    - **`MonthPicker`** reutilizável (Popover + grade de meses + nav de ano) + **botão atualizar** (refetch das queries). **Lib de gráficos: Recharts** (bar+donut; resto CSS puro) — ver [[recharts-graficos-dash]]. Dados dos hooks existentes, nada mudou no back. Removidas Home RarUI antiga + `Header`/`Menu`/`Sidebar` RarUI órfãos. Token `card2` adicionado (restart do dev server necessário — ver [[rebrand-etapa1-foundation]]). Validado no browser (2 temas, navegação de mês). Falta: Calendário, Patrimônio.
- **Etapa 3** (backend novo): 3.1 Tags → 3.2 Contas a pagar/recorrentes → 3.3 Importação de extrato. (models de recorrência/tags já gerados; abas placeholder já existem no hub de Cadastros.)
