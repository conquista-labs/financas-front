---
name: new-usecase
description: Cria o slice vertical completo de Clean Architecture para um endpoint da API neste projeto — use case no domain + implementação no data + factory no main + hook React Query na presentation + exports nos barrels. Use ao adicionar um endpoint novo (get/getById/post/patch/delete) para um recurso, ou quando o usuário pedir "criar usecase", "novo endpoint", "adicionar rota da API", "ligar um endpoint".
---

# new-usecase

Gera o slice vertical completo de um endpoint seguindo as convenções exatas deste repo, de forma
que nenhuma camada ou barrel seja esquecido e bugs de copiar-colar (`queryKey` errada, `staleTime`
ausente) sejam evitados.

## Entradas a coletar primeiro

Pergunte ao usuário (ou infira da mensagem dele) apenas o que estiver faltando:

1. **Recurso** — a pasta do recurso da API, camelCase plural como usado no codebase
   (ex.: `transacoes`, `pessoas`, `categorias`). É o nome da pasta em todas as camadas.
2. **Método HTTP** — um de: `get` (lista), `getId` (por id), `post`, `patch`, `delete`.
3. **Rota** — o caminho da API, ex.: `/transacoes` ou `/transacoes/:id`.
4. **Models de request/response** — os nomes das interfaces em `src/domain/models`. Se ainda não
   existirem, confirme com o usuário antes de criá-los (models do backend costumam ser gerados por
   OpenAPI — NÃO invente campos; pergunte). Use a skill `new-domain-model` para criá-los.

Derive o nome base em PascalCase a partir de recurso + método, batendo exatamente com os irmãos
existentes. Ex.: recurso `transacoes` + `getId` → `GetTransacoesId`; + `post` → `PostTransacoes`.
**Antes de gerar, leia um slice irmão existente do mesmo método** (ex.: inspecione
`src/data/usecases/transacoes/getTransacoes/`) e espelhe-o — ele é a fonte da verdade; este arquivo
é só o mapa.

## Camadas a criar (todas elas)

Para o método `<Metodo>` no recurso `<recurso>` com nome base `<Base>`:

### 1. Domain — `src/domain/usecases/<recurso>/<metodo>/<metodo>.ts`

- Interface `<Base>UseCase` com um único método nomeado pelo verbo
  (`get` / `post` / `patch` / `delete`).
- `<Base>Model` = o model de response de `@/domain/models`.
- Para get/getId/delete: tipo `<Base>Params`. Para post/patch: tipo `<Base>Request`.
- Adicione `index.ts` re-exportando, e adicione `export * from "./<metodo>"` em
  `src/domain/usecases/<recurso>/index.ts`.

### 2. Data — `src/data/usecases/<recurso>/<metodo>/<metodo>.ts`

- Classe `<Base>` implementando a interface do domain, construtor `(url, httpClient)`.
- Chame `this.httpClient.request<...>({ url, method, params|body })`.
- Para rotas com `:id` use `this.url.replace(":id", params.id)`.
- `switch (httpResponse.statusCode)`: caso de sucesso retorna o body
  (`HttpStatusCode.ok`, ou `HttpStatusCode.created` para POST),
  `unauthorized` → `throw new InvalidCredentialsError()`, `default` → `throw new UnexpectedError()`.
- Adicione `index.ts` e a entrada no barrel `src/data/usecases/<recurso>/index.ts`.

### 3. Factory no main — `src/main/factories/usecases/<recurso>/<metodo>Factory/<metodo>Factory.ts`

- `export const make<Base>Factory = (): <Base>UseCase => new <Base>(makeApiUrl("<rota>"), makeAuthorizeHttpClient());`
- Adicione `index.ts` e a entrada no barrel `src/main/factories/usecases/<recurso>/index.ts`.

### 4. Hook na presentation — `src/presentation/hooks/api/<recurso>/use<Base>/`

- **Queries (get/getId)**: `use<Base>.ts` usando `useQuery`, `queryKey: ["<metodo>-<recurso>", params]`
  (⚠️ faça a key bater com o recurso — não copie a key de outro recurso),
  `queryFn` aguarda o método da factory dentro de try/catch, espalha `...options`.
  Para `get` de lista simples, inclua `staleTime: DAY_TIME, gcTime: DAY_TIME` (importe de `@/app.definitions`).
  Mais `use<Base>.types.ts` com `Omit<UseQueryOptions<...>, "queryKey" | "queryFn">`.
- **Mutations (post/patch/delete)**: `use<Base>.tsx` usando `useMutation`, `useQueryClient` e
  `useToast` de `@rarui-react/components/dist/Toast`. `mutationKey: ["<metodo>-<recurso>"]`,
  `onSuccess` invalida a query de lista (`queryKey: ["get-<recurso>"]`), `onError` mostra um
  toast de erro (appearance `"error"`, variant `"solid"`, duration `4000`).
  Mais `use<Base>.types.ts` com `Omit<UseMutationOptions<Model, AxiosError, Request|Params, unknown>, "mutationKey" | "mutationFn">`.
- Adicione `index.ts` e a entrada no barrel `src/presentation/hooks/api/<recurso>/index.ts`.

> Nota do rebrand: quando as telas migrarem para shadcn, os toasts das mutations passarão a usar
> `sonner` no lugar do `useToast` do RarUI. Enquanto o recurso ainda for consumido por telas RarUI,
> mantenha o `useToast` do RarUI para não quebrar o padrão. Ver a skill `migrate-page-to-shadcn`.

## Depois de gerar

> Este repo usa **yarn 4** (`yarn.lock`, `.yarnrc.yml`). Nunca rode `npm` aqui — ele corrompe o
> `yarn.lock`. Use sempre `yarn`.

1. Rode `yarn lint` e corrija o que aparecer nos arquivos novos.
2. Rode `yarn build` (ou `yarn tsc --noEmit`) para confirmar que os tipos resolvem.
3. Reporte os arquivos criados como um checklist e lembre o usuário de que este slice ainda não tem
   testes — ofereça rodar a skill `add-usecase-tests`.
