---
name: migrate-page-to-shadcn
description: Migra UMA página da presentation de RarUI para a nova identidade "Nossa Grana" (Tailwind + shadcn/ui), trocando componentes/ícones RarUI por shadcn + tokens, aplicando os design tokens (bg/fg/primary, font-display para números) e removendo os imports @rarui daquela página — SEM tocar em domain/data/main/hooks. Use durante o rebrand ao migrar uma tela (Transações, Home, Calendário, Patrimônio, Cadastros...), ou quando o usuário pedir "migrar a tela X", "repaginar", "aplicar a nova cara em X".
---

# migrate-page-to-shadcn

Repagina uma página na nova identidade. O propósito inteiro da Clean Architecture do projeto é que
**isto é uma mudança só de apresentação**: as camadas domain/data/main e os hooks React Query em
`src/presentation/hooks/api` ficam intactos. Se uma migração parecer precisar de mudanças abaixo da
camada de apresentação, pare e sinalize — isso é um cheiro, não um requisito.

## Fontes da verdade

- Design tokens, specs de tela, interações: `design_handoff_nossa_grana 2/README.md`.
- Aparência/comportamento exatos: o protótipo `design_handoff_nossa_grana 2/Financas Repaginado.dc.html`
  (só referência — NÃO é código para copiar; recrie com os nossos componentes).
- Notas de endpoint + estado por tela: `ETAPA_1_fundacao_shell_transacoes.md` e `API_REFERENCE.md`.
- A fundação já existe (ver a memória `rebrand-etapa1-foundation`): tokens, `cn()`, `enhance()` em
  `src/lib/color.ts`, tema via `data-theme`/`.dark` na `<html>`.

## Regras

- **yarn 4 apenas** — nunca `npm`. Instale primitivos shadcn com a skill `add-shadcn-component`.
- Migre uma página por vez; o app tem que continuar buildando o tempo todo (RarUI coexiste).
- Mantenha o fluxo de dados da página idêntico — reuse os hooks existentes
  (`useGet*/usePost*/...`) e as mesmas leituras de envelope (`data.rows` / `data.meta` /
  `data.resume.total`).

## Passos da migração (para `src/presentation/pages/<Name>/`)

1. **Leia a página-alvo por inteiro** e liste cada import de `@rarui-react/components` /
   `@rarui/icons` e cada componente RarUI usado (`Box`, `Button`, `IconButton`, `Table`,
   `ColumnsDefinitions`, `Title`, `Status`, `Select`, toast, etc.).
2. **Mapeie cada um para o novo stack**:
   - `Box` → `div` puro com classes Tailwind (`flex`, `gap-*`, tokens `bg-card`, `text-fg`...).
   - `Button` / `IconButton` → `Button` do shadcn (instale se faltar). Ação primária usa
     `bg-primary text-white shadow-primary rounded-btn`.
   - Ícones RarUI → equivalentes do `lucide-react`.
   - Toasts (`useToast`) → `sonner` (`toast(...)`); ações destrutivas/mutations ganham **Desfazer**
     onde o handoff pedir (`toast(..., { action: { label: "Desfazer", onClick }})`).
   - `Table` + `ColumnsDefinitions` → o novo padrão de lista/tabela (table do shadcn ou a lista de
     altura fixa com scroll interno e rodapé fixo do handoff — siga a spec da tela).
   - Modais → `dialog` do shadcn (desktop) / `sheet` bottom (mobile, `< 900px`).
3. **Aplique tokens & tipografia**: valores monetários e títulos usam `font-display` (Space
   Grotesk) com `tracking-tight`; cores de categoria passam por `enhance()` de `@/lib/color` na
   exibição (guarde o hex original). Verde para receita, `text-danger` para despesa.
4. **Remova os imports `@rarui` daquela página** assim que nada mais usar. NÃO arranque o RarUI do
   app inteiro — só desta página (migração progressiva).
5. **Selects/opções** vêm da API (`GET /enums`, `/categorias`, `/pessoas`, `/meios-pagamento`) via
   hooks existentes — nunca hardcode.

## Verificação (obrigatória)

1. `yarn lint` e `yarn build` passam.
2. Rode a página no app real e confira os dois temas com a skill `verify-visual`.
3. Confirme que nenhum import `@rarui` sobrou na página migrada:
   `grep -rn "@rarui" src/presentation/pages/<Name>`.
4. Reporte: componentes trocados, ícones mapeados, RarUI removido, e qualquer mudança abaixo da
   apresentação que você tenha precisado fazer (deve ser nenhuma).
