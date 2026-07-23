---
name: new-page
description: Cria uma página CRUD de recurso em src/presentation/pages seguindo a estrutura do repo (página de lista com Table + Breadcrumb, subpáginas Create/Edit, Form compartilhado, definições de coluna) e faz o wiring no router (urlRouters + private-route + barrel de pages). LEGADA (padrão RarUI) — durante o rebrand prefira migrate-page-to-shadcn. Use apenas se o usuário pedir "criar página", "nova tela" para uma tela que ainda seja RarUI.
---

# new-page

> ⚠️ **LEGADA (padrão RarUI) — durante o rebrand, prefira NÃO usar.**
> Esta skill gera páginas no padrão RarUI antigo (`Box`, `Button`, `IconButton`,
> `ColumnsDefinitions`, `@rarui/icons`), que o rebrand "Nossa Grana" (Tailwind + shadcn) está
> substituindo. Use-a apenas para uma página que ainda seja RarUI e precise sair rápido.
> Para telas novas na nova identidade, use **migrate-page-to-shadcn** como referência do padrão
> alvo. Esta skill será reescrita para shadcn assim que a tela de Transações estabelecer o novo
> padrão de página.

Gera um slice de página de recurso em `src/presentation/pages/<Name>/` espelhando as páginas
`Peoples` / `Categories` existentes, mais o wiring do router. Assume que os hooks de API do recurso
já existem (`useGet<Recurso>`, `usePost<Recurso>`, etc.) — se não existirem, crie-os antes com a
skill `new-usecase`.

## Entradas

1. **Nome da página** — PascalCase, em inglês, batendo com o vocabulário do router
   (ex.: `MeansOfPayment`, `Patrimony`).
2. **Base da rota** — caminho kebab, ex.: `/means-of-payment`.
3. **Hooks do recurso** — os hooks de `@/presentation/hooks/api` a consumir
   (lista, create, edit, delete).
4. **Colunas da lista** — os campos a mostrar na tabela e seus rótulos.

**Leia a página `Peoples` por inteiro primeiro** (`src/presentation/pages/Peoples/**`) — é a
implementação de referência; este arquivo é só o checklist.

## Arquivos a criar — `src/presentation/pages/<Name>/`

- `<Name>.tsx` — página de lista: `Box` flex column, `<Breadcrumb crumbs={["<key>"]} />`, um botão
  `Cadastrar` alinhado à direita `Button as={Link} to={urlRouters.create<Name>}`, e `<Table>`
  alimentada por `getColumns(...)` do arquivo de definições. Use `usePagination()` de
  `@/presentation/hooks/core` e passe `{ page, limit: pageSize }` ao hook de lista.
- `<name>.definitions.tsx` — `getColumns(navigate, mutate, refetch)` montado com
  `new ColumnsDefinitions<any>()`, um `IconButton` de editar (`EditFilledIcon`) navegando para
  `urlRouters.edit<Name>.replace(":id", field)` e um `IconButton` de excluir danger
  (`TrashFilledIcon`) chamando `mutate({ id: field }, { onSuccess: refetch })`. Ícones de
  `@rarui/icons` — verifique os nomes na galeria conforme o CLAUDE.md.
- `components/Form/` — `Form.tsx` (React Hook Form + resolver Yup), `form.types.ts`,
  `form.definitions.ts`, `index.ts`. Espelhe `Peoples/components/Form`.
- `pages/Create/Create.tsx` e `pages/Edit/Edit.tsx` — consomem os hooks de post/patch e renderizam
  o `<Form>`; cada um com um `index.ts`. Breadcrumb `crumbs={["<key>", "create<Name>"]}` etc.
- `pages/index.ts`, `components/index.ts`, e o `<Name>/index.ts` de topo
  (`export { default as <Name> } from "./<Name>"; export * from "./pages";`).

## Wiring do router (faça os três)

1. `src/presentation/router/router.definitions.ts` — adicione as entradas `<name>`, `create<Name>`,
   `edit<Name>` em `urlRouters` (o caminho de edit termina em `/:id`).
2. `src/presentation/router/proxies/private-route.tsx` — importe a página + Create/Edit e adicione
   as entradas `<Route>` envolvidas em `<Suspense>`, batendo com o padrão existente.
3. `src/presentation/pages/index.ts` — adicione `export * from "./<Name>";`.
4. Se o recurso deve aparecer na navegação, adicione-o ao componente Sidebar/Menu e ao mapa de
   rótulos do Breadcrumb — veja onde as páginas existentes registram seu rótulo de crumb.

## Depois de gerar

> Este repo usa **yarn 4** — nunca rode `npm` aqui (corrompe o `yarn.lock`).

Rode `yarn lint` e `yarn build` (ou `yarn tsc --noEmit`) para confirmar que tudo resolve e as rotas
compilam. Reporte os arquivos criados e as edições do router como um checklist.
