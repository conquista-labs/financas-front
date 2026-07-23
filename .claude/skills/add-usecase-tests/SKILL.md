---
name: add-usecase-tests
description: Gera testes unitários Vitest (.spec.ts) para use cases da camada data e factories da camada main neste projeto, seguindo as convenções de teste do repo (HttpClient mockado, ramos de status ok/unauthorized/default). Use quando o usuário pedir "adicionar testes", "cobrir com testes", "testar o usecase", ou após criar um endpoint que está sem cobertura. O pre:push do repo roda coverage, então slices novos devem ter teste.
---

# add-usecase-tests

Escreve arquivos `.spec.ts` batendo com o setup Vitest + Testing Library + MSW do repo. Os testes
ficam colocados ao lado do arquivo sob teste (mesma pasta, sufixo `.spec.ts`).

## Antes de escrever

1. Leia o use case sob teste e sua interface no domain para saber o verbo
   (`get`/`post`/`patch`/`delete`), o formato de params/body e o status code de sucesso.
2. Procure um `.spec.ts` existente no repo (ex.:
   `src/main/factories/http/axiosHttpClientFactory.spec.ts`, ou qualquer spec da camada data se
   houver) e espelhe sua estrutura, imports e a redação em português dos `describe`/`it`
   (`"deve ..."`).
3. Verifique `src/data/protocols` para a interface `HttpClient` e o enum `HttpStatusCode`, e
   `src/domain/errors` para `InvalidCredentialsError` / `UnexpectedError` — use esses tipos exatos.

## Spec do use case da data (`<metodo>.spec.ts`)

Cubra cada ramo do `switch (httpResponse.statusCode)`:

- **sucesso** (`ok` / `created`): mocke `httpClient.request` para resolver com o status de sucesso
  e um body; verifique que o método resolve com esse body e que `request` foi chamado com a `url`,
  o `method` e os `params`/`body` corretos (incluindo a substituição de `:id` em rotas com id).
- **unauthorized**: mocke `unauthorized`; verifique que rejeita com `InvalidCredentialsError`.
- **default**: mocke qualquer outro status (ex.: `serverError`/`badRequest`); verifique que
  rejeita com `UnexpectedError`.

Use um mock de `HttpClient` feito à mão (um objeto spy com um mock de `request`, ex.: `vi.fn()`),
não uma chamada de rede real. Monte um helper `makeSut()` que retorna `{ sut, httpClientSpy }` se
esse padrão já existir no repo; senão, mantenha simples e inline.

## Spec da factory (`<metodo>Factory.spec.ts`)

Espelhe `axiosHttpClientFactory.spec.ts`: verifique que `make<Base>Factory()` retorna uma
instância da classe concreta da data (`expect(result).toBeInstanceOf(<Base>)`).

## Depois de escrever

> Este repo usa **yarn 4** — nunca rode `npm` aqui (corrompe o `yarn.lock`).

Rode `yarn test <path>` (ou `yarn vitest run <path>`) para os specs novos e confirme que passam.
Reporte pass/fail com honestidade e o output; se um teste falhar, corrija em vez de apagar o caso.
