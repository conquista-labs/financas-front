# API — endpoints que o front web NÃO consome

> Levantamento feito cruzando o `swagger.yaml` (~42 rotas) com o uso real no front
> (usecases/factories/hooks + chamada efetiva em página/componente). Objetivo: ajudar o
> backend a decidir o que dá pra **remover/aposentar**. Data: 2026-07-23.
>
> **Contexto do front:** boa parte do CRUD é chamada via **factory direta** (não pelo hook
> `useXxx`), dentro de `useRegisterMutations.ts` (categorias/pessoas/meios) e
> `usePatrimonyMutations.ts` (patrimônios). Então POST/PATCH/DELETE desses recursos ESTÃO em
> uso mesmo quando o hook correspondente parece morto. Já considerei isso abaixo.

---

## 🔴 Grupo 1 — SEM cliente no front (candidatos fortes a remover)

Estas rotas existem no backend mas **o front não tem nem usecase/factory/hook** — nunca são
chamadas de lugar nenhum. São 13 rotas:

| Endpoint                               | Método(s)          | Observação                                                     |
| -------------------------------------- | ------------------ | -------------------------------------------------------------- |
| `/admin/allowed-emails`                | GET, POST          | painel admin — sem tela no front web                           |
| `/admin/allowed-emails/active`         | GET                | idem                                                           |
| `/admin/allowed-emails/{id}`           | PUT, DELETE        | idem                                                           |
| `/admin/allowed-emails/{id}/permanent` | DELETE             | idem                                                           |
| `/auth/register`                       | POST               | não há cadastro por email/senha no front (só Google)           |
| `/calendar/list`                       | GET                | o calendário do front usa `/transacoes/calendario`, não este   |
| `/calendar/set-preferred`              | POST               | idem — sem uso                                                 |
| `/patrimonios/snapshots/create`        | POST               | nenhuma referência no front                                    |
| `/recorrencias`                        | GET, POST          | recorrências ainda não têm tela (Etapa 3)                      |
| `/recorrencias/gerar`                  | POST               | idem                                                           |
| `/recorrencias/{id}`                   | GET, PATCH, DELETE | idem                                                           |
| `/tags`                                | GET                | não há CRUD de tags no front (tags nascem ao lançar transação) |
| `/tags/{id}`                           | PATCH, DELETE      | idem                                                           |

**Atenção antes de remover:**

- **`/recorrencias/*`** e **`/tags/*`** provavelmente são **feature planejada** (Etapa 3 do
  rebrand), não lixo. Se o roadmap ainda prevê recorrências e gestão de tags, **manter**.
- **`/admin/allowed-emails/*`** e **`/auth/register`**: confirmar se há outro consumidor
  (painel admin separado, app mobile, script). No **front web** não há.
- **`/calendar/list` e `/calendar/set-preferred`**: parecem resquício de uma abordagem antiga
  de calendário (a atual é `/transacoes/calendario`). Bons candidatos se ninguém mais usa.
- **`/patrimonios/snapshots/create`**: se os snapshots de patrimônio são gerados por outro
  fluxo (job/cron), a rota manual pode ser desnecessária — confirmar.

---

## 🟡 Grupo 2 — Cliente existe no front mas NÃO é chamado (decisão conjunta)

O front **tem** o cliente pronto (usecase/factory/hook), mas nenhuma tela o invoca hoje. Não é
"lixo de backend" necessariamente — pode ser feature não plugada. Só sinalizando:

| Endpoint                       | Método | Situação                                                                           |
| ------------------------------ | ------ | ---------------------------------------------------------------------------------- |
| `/analytics/padroes-temporais` | GET    | hook pronto, dash **não plugou**. Feature futura?                                  |
| `/analytics/tendencias`        | GET    | hook pronto, dash **não plugou**. Feature futura?                                  |
| `/auth/login`                  | POST   | cliente existe mas auth do front é **100% Google**.                                |
| `/resumo-financeiro/{ano}`     | POST   | hook pronto, nenhuma tela chama (o GET `/resumo-financeiro` sem ano ESSE é usado). |
| `/categorias/{id}`             | GET    | CRUD usado; só o **GET-by-id** não (edição usa o item já carregado na lista).      |
| `/meios-pagamento/{id}`        | GET    | idem — GET-by-id não usado.                                                        |
| `/pessoas/{id}`                | GET    | idem — GET-by-id não usado.                                                        |
| `/patrimonios/{id}`            | GET    | idem — GET-by-id não usado.                                                        |

> Os **GET-by-id** (`/{id}`) dos 4 recursos acima: PATCH e DELETE dos mesmos `/{id}` **são
> usados** (via factory nas mutations). Só a **leitura individual** não é chamada, porque os
> hubs editam a partir do item já em memória (sem refetch). Manter os GET-by-id é barato e
> pode ser útil (deep-link, refresh), então **sugiro manter** — só sinalizando que hoje o web
> não bate neles.

---

## 🟢 Grupo 3 — EM USO (não mexer)

Todo o resto está em uso ativo:
`/analytics/categorias`, `/analytics/meios-pagamento`, `/analytics/orcamento`,
`/analytics/quick-stats`, `/auth/google-login`, `/auth/google/disconnect`, `/categorias` (GET+POST),
`/categorias/{id}` (PATCH+DELETE), `/enums`, `/importacoes/analisar`, `/importacoes/confirmar`,
`/meios-pagamento` (GET+POST) e `/{id}` (PATCH+DELETE), `/pessoas` (GET+POST) e `/{id}` (PATCH+DELETE),
`/patrimonios` (GET+POST), `/patrimonios/evolucao`, `/patrimonios/resumo`, `/patrimonios/{id}`
(PATCH+DELETE), `/relatorios/transacoes`, `/resumo-financeiro` (GET), `/transacoes` (GET+POST),
`/transacoes/calendario`, `/transacoes/{id}` (GET+PATCH+DELETE), `/transacoes/{id}/pagar`.

---

## Resumo executivo

- **Remoção mais segura (confirmar que não há outro consumidor):** `/admin/allowed-emails` (4
  rotas), `/calendar/list` + `/calendar/set-preferred`, `/patrimonios/snapshots/create`,
  `/auth/register`, `/auth/login`.
- **Segurar se ainda no roadmap:** `/recorrencias/*` (3) e `/tags/*` (2) — o front vai
  implementar na Etapa 3.
- **Não remover, só não-plugado hoje:** os 2 analytics extras e os GET-by-id.

Do lado do **front**, os models TypeScript soltos (`*Recorrencia*`, `*Tag*`, `*AllowedEmail*`)
podem ser limpos independentemente — mas só depois que o backend decidir sobre recorrências/tags
(se forem implementadas, os models voltam a ser úteis).
