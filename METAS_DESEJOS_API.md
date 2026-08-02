# Metas & Desejos — referência da API (para o front)

Implementação do módulo especificado em [`METAS_DESEJOS_BACKEND.md`](./METAS_DESEJOS_BACKEND.md).
Todos os endpoints são **autenticados** (Bearer JWT) e usam o envelope padrão
`{ message, data }`. Os enums novos (`tipoMeta`, `statusMeta`, `prioridadeDesejo`)
já vêm no `GET /enums`.

> Status: **pronto no dev, testado end-to-end**. Ainda não em produção (entra no
> próximo deploy — a migration é aditiva, roda no `prisma migrate deploy`).

---

## Conceito

- **Desejo** — ideia leve do casal, com votos. Não afeta nenhum número financeiro.
- **Meta** — desejo com plano: valor alvo, prazo, aporte mensal e uma **tag** vinculada.
- **Progresso** — **não é digitado**. É derivado: `valorInicial + soma das
transações que carregam a tag da meta`.
- **Aporte** — uma `Transacao` de despesa normal com a tag da meta (já entra no
  extrato/dashboard). Não é entidade própria.

Convenções: valores são **número cru**, datas em **ISO**. `pessoaId: null` numa
meta = **Casal**.

---

## Metas — `/metas`

| Método | Rota                       | Descrição                                        |
| ------ | -------------------------- | ------------------------------------------------ |
| GET    | `/metas?status=&pessoaId=` | Lista com progresso (default: exclui arquivadas) |
| GET    | `/metas/resumo`            | Cards do topo / dashboard                        |
| GET    | `/metas/:id`               | Detalhe + histórico de 6 meses                   |
| POST   | `/metas`                   | Cria                                             |
| PATCH  | `/metas/:id`               | Edita o plano                                    |
| DELETE | `/metas/:id`               | Arquiva (soft delete — tem "Desfazer")           |
| POST   | `/metas/:id/restaurar`     | Desfaz o arquivamento                            |
| POST   | `/metas/:id/aportes`       | Registra um aporte                               |

### POST /metas

```json
{
  "titulo": "Reforma da cozinha",
  "tipo": "acumular",
  "valorAlvo": 28000,
  "valorInicial": 16400,
  "aporteMensal": 1200,
  "dataAlvo": "2027-03-01",
  "tag": "meta-cozinha",
  "pessoaId": null,
  "patrimonioId": null,
  "desejoId": "uuid-opcional"
}
```

- `tipo`: `acumular` (juntar) | `quitar` (abater dívida). Ambos usam a mesma
  regra de progresso (soma das transações da tag).
- `tag` é o **nome** em string (não id) — o backend faz connectOrCreate. Se vier
  vazio, é gerado do título (`meta-<2 primeiras palavras>`).
- **Rejeita 400** se a tag já alimenta outra meta ativa (evita contagem dupla).
- `valorInicial` deve ser `<= valorAlvo` (senão 400).
- `dataAlvo` é normalizada para o **dia 1º do mês**.
- Se `desejoId` vier, o desejo é vinculado e **arquivado**.

### Item de resposta (GET /metas)

```json
{
  "id": "uuid",
  "titulo": "Reforma da cozinha",
  "tipo": "acumular",
  "valorAlvo": 28000,
  "valorAtual": 16400,
  "falta": 11600,
  "percentual": 59,
  "aporteMensal": 1200,
  "aporteNecessario": 1450,
  "noRitmo": false,
  "statusProgresso": "atrasada",
  "status": "ativa",
  "etaMeses": 10,
  "dataAlvo": "2027-03-01T00:00:00.000Z",
  "tag": { "id": "uuid", "nome": "meta-cozinha" },
  "pessoa": null
}
```

> **Dois "status", de propósito:**
>
> - `statusProgresso` (`no_ritmo` | `atrasada` | `concluida`) — derivado do
>   cálculo, para a UI de progresso.
> - `status` (`ativa` | `concluida` | `arquivada`) — persistido no banco.
>
> Campos derivados: `valorAtual`, `falta`, `percentual` (0–100, capado),
> `aporteNecessario` (`falta / mesesRestantes`), `noRitmo`
> (`aporteMensal >= aporteNecessario * 0.95`), `etaMeses`
> (`ceil(falta / aporteMensal)`, ou `null` se aporteMensal 0).

### GET /metas/:id

Inclui tudo do item acima, mais:

```json
{
  "historico": [
    { "mes": "2026-02", "valor": 0 },
    { "mes": "2026-03", "valor": 1200 },
    { "mes": "2026-04", "valor": 1200 },
    { "mes": "2026-05", "valor": 1500 },
    { "mes": "2026-06", "valor": 1200 },
    { "mes": "2026-07", "valor": 1400 }
  ],
  "mediaAportes": 1233.33
}
```

`historico` tem sempre **6 pontos** (meses sem aporte vêm com `valor: 0`).

### GET /metas/resumo

```json
{
  "totalGuardado": 104465,
  "totalAlvo": 271000,
  "percentual": 39,
  "aportadoNoMes": 5700,
  "aportePlanejado": 5400,
  "metasNoRitmo": 3,
  "metasTotal": 4,
  "destaques": [
    /* as 2 metas mais adiantadas (mesmo formato do item) */
  ]
}
```

`metasNoRitmo` inclui as concluídas (uma meta pronta está "no ritmo ou melhor").

### POST /metas/:id/aportes

```json
{
  "valor": 1200,
  "data": "2026-07-28",
  "meioPagamentoId": "uuid",
  "descricao": "Aporte reforma"
}
```

- Cria uma `Transacao` (despesa) com a tag da meta e devolve **a meta recalculada**.
- `descricao` default: `"Aporte · " + título da meta`.
- Se o aporte fechar a meta (`falta <= 0`), ela volta com `status: "concluida"`
  automaticamente (com `concluidaEm` preenchido).

### PATCH /metas/:id

Mesmos campos do POST (todos opcionais), exceto `desejoId`. Trocar a `tag`
revalida a regra de tag exclusiva.

### DELETE /metas/:id & POST /metas/:id/restaurar

DELETE faz soft delete (`status = arquivada`) e devolve `{ "id" }`. Restaurar
volta para `ativa` (limpando `concluidaEm`). Suporte ao "Desfazer" do toast.

---

## Desejos — `/desejos`

| Método | Rota                           | Descrição                                   |
| ------ | ------------------------------ | ------------------------------------------- |
| GET    | `/desejos?arquivados=false`    | Lista (ordem: votos ↓, prioridade, valor ↑) |
| POST   | `/desejos`                     | Cria                                        |
| PATCH  | `/desejos/:id`                 | Edita                                       |
| PUT    | `/desejos/:id/votos/:pessoaId` | Vota (idempotente)                          |
| DELETE | `/desejos/:id/votos/:pessoaId` | Remove voto (idempotente)                   |
| DELETE | `/desejos/:id`                 | Arquiva (soft delete)                       |
| POST   | `/desejos/:id/promover`        | Promove a meta                              |

### POST /desejos

```json
{
  "titulo": "Sofá novo",
  "nota": "seccional cinza",
  "valorEstimado": 4500,
  "prioridade": "media",
  "votos": ["uuid-pessoa-1"]
}
```

`prioridade`: `alta` | `media` | `baixa` (default `media`). `votos` é opcional —
lista de `pessoaId` que já votam ao criar.

### Item de resposta

```json
{
  "id": "uuid",
  "titulo": "Sofá novo",
  "nota": "seccional cinza",
  "valorEstimado": 4500,
  "prioridade": "media",
  "metaId": null,
  "arquivado": false,
  "votos": [{ "pessoaId": "uuid", "nome": "Vivi" }],
  "todosQuerem": false,
  "createdAt": "2026-07-28T..."
}
```

- `todosQuerem`: `true` quando **todas as pessoas ativas** votaram (o selo "os
  dois querem").
- `metaId`: preenchido depois que o desejo é promovido.

### Votar / desvotar

`PUT /desejos/:id/votos/:pessoaId` e `DELETE` são **idempotentes** (chave é o par
desejo+pessoa): votar duas vezes não duplica; remover um voto inexistente não dá
erro. Ambos devolvem o desejo atualizado.

### POST /desejos/:id/promover

Body = mesmo do `POST /metas`, **sem** `desejoId` (ele é o próprio desejo). Cria
a meta e arquiva o desejo. Rejeita **400** se já foi promovido.

---

## Enums (`GET /enums`)

Três chaves novas, no mesmo formato `{ value, label }`:

- `tipoMeta`: `acumular` / `quitar`
- `statusMeta`: `ativa` / `concluida` / `arquivada`
- `prioridadeDesejo`: `alta` / `media` / `baixa`
