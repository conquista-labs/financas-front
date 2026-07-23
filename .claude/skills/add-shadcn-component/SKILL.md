---
name: add-shadcn-component
description: Instala um componente shadcn/ui no layout de Clean Architecture do projeto (src/presentation/components/ui) com o alias correto e a ponte de tokens que mapeia os tokens padrão do shadcn (background/foreground/...) para os tokens próprios do projeto (bg/fg/primary...). Use ao adicionar qualquer componente shadcn (button, dialog, sheet, select, sonner, etc.) durante o rebrand "Nossa Grana", ou quando o usuário pedir "instalar componente shadcn", "adicionar um shadcn <x>".
---

# add-shadcn-component

Adiciona primitivos do shadcn/ui do jeito certo para este repo. A fundação já está configurada
(`components.json`, `tailwind.config.ts`, `src/lib/utils.ts` com `cn()`,
`src/presentation/assets/styles/tailwind.css` com as vars de token). Esta skill trata das duas
coisas que o `shadcn add` cru erra aqui: o **gerenciador de pacotes** e a **ponte de tokens**.

## Regras de base

- **yarn 4 apenas.** Rode a CLI com `yarn dlx shadcn@latest ...`. Nunca `npm`/`npx` (corrompe o
  `yarn.lock`). O shadcn NÃO é dependência do projeto — ele roda via `dlx`.
- Os componentes vão para `src/presentation/components/ui/` (alias
  `@/presentation/components/ui`, configurado em `components.json`).
- Depois de instalar, re-exporte os componentes novos de `src/presentation/components/index.ts`
  se a convenção de barrel do repo esperar isso (verifique antes).

## Instalação

```bash
yarn dlx shadcn@latest add <componente> [<componente> ...]
```

Conjunto comum para a Etapa 1 (conforme o guia): `button dialog sheet select dropdown-menu tabs
input textarea switch checkbox popover tooltip badge sonner scroll-area avatar separator skeleton`.

## Organização por COMPLEXIDADE (não por origem)

Depois do `add`, decida onde cada componente vive pela complexidade dele:

- **Peça única** (1 export principal — Button, Avatar, Separator, Input, Switch, Badge,
  Toaster/sonner): crie um wrapper no padrão do projeto (pasta PascalCase + index) que
  re-exporta o primitivo, e exponha no barrel `components/index.ts`. A app importa de
  `@/presentation/components`. O arquivo cru pode ficar em `ui/` (o wrapper aponta pra ele) ou
  a lógica pode morar direto na pasta PascalCase quando for código nosso (ex.: Toaster).
- **Kit composto** (10-15 sub-componentes montados juntos — Dialog, Sheet, DropdownMenu,
  Tooltip, Select, Tabs): NÃO force em "1 pasta = 1 componente" (é artificial). Deixe como
  arquivo único em `ui/` e importe de `@/presentation/components/ui`.

Cuidado real: se um componente shadcn se compõe de OUTRO (ex.: `combobox` importa `popover`),
o `add` gera `import ... from "@/.../ui/<outro>"`. Só nesse caso o padrão de pasta do
dependido importa — mantê-lo em `ui/` evita corrigir o path na mão. Verifique com
`grep -rn "components/ui/" src/presentation/components/ui/*.tsx` se há composição interna.

## Ponte de tokens (CRÍTICO — faça isso uma vez, antes/depois do primeiro componente)

Componentes shadcn referenciam classes Tailwind como `bg-background`, `text-foreground`,
`border-border`, `ring-ring`, `bg-muted`, `bg-destructive`. Este projeto deliberadamente usa seus
próprios tokens semânticos (`bg`, `card`, `fg`, `fg2`, `line`, `primary`, `danger`...). Então os
nomes de classe do shadcn não têm token por trás, a não ser que a gente adicione a ponte.

Adicione as CSS vars com os nomes do shadcn como **aliases** dos nossos tokens. Em
`src/presentation/assets/styles/tailwind.css`, dentro do `:root` e do bloco dark, mapeie:

| var do shadcn                        | nosso token           |
| ------------------------------------ | --------------------- |
| `--background`                       | `--bg`                |
| `--foreground`                       | `--fg`                |
| `--card` / `--popover`               | `--card`              |
| `--muted` / `--muted-foreground`     | `--track` / `--muted` |
| `--border` / `--input`               | `--line`              |
| `--primary` / `--primary-foreground` | `--primary` / branco  |
| `--destructive`                      | `--danger`            |
| `--ring`                             | `--primary`           |
| `--radius`                           | `13px` (nosso `btn`)  |

Depois, estenda `tailwind.config.ts` em `theme.extend.colors` com os nomes do shadcn apontando para
essas vars (mesmo padrão `rgb(var(--x) / <alpha-value>)` já usado), para `bg-background` etc.
resolverem. **Prefira** editar os componentes gerados para usar nossos tokens direto (ex.: trocar
`bg-background` → `bg-card`) apenas quando o componente for pequeno e claramente pontual; para os
primitivos compartilhados, a ponte dá menos retrabalho. Decida por componente e mantenha
consistente.

## Verificação

1. `yarn build` — confirma que o componente + tokens compilam.
2. Renderize o componente nos dois temas (ver a skill `verify-visual`) — confira que lê bem no
   claro e no `data-theme="dark"`.
3. Reporte quais componentes foram adicionados e se a ponte de tokens foi mexida.
