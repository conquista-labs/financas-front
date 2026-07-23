import type { CreateTransacaoRequest, Transacao } from "@/domain/models";
import { parseAmount } from "@/lib/format";

import type { TransactionFormValues } from "./TransactionForm";

/**
 * Converte a transação vinda da API (Edit) para os valores do formulário.
 * O valor pode vir como number ou string "R$ …" — normaliza para string
 * editável "1234,56"; a data para "yyyy-MM-dd".
 */
export const fromTransacao = (
  t: Transacao,
): Partial<TransactionFormValues> => ({
  categoriaId: t.categoriaId,
  pessoaId: t.pessoaId,
  meioPagamentoId: t.meioPagamentoId ?? "",
  formaPagamento: t.formaPagamento ?? "",
  data: (t.data ?? "").slice(0, 10) || new Date().toISOString().slice(0, 10),
  descricao: t.descricao,
  valor: String(parseAmount(t.valor)).replace(".", ","),
  observacoes: t.observacoes ?? "",
  lembrarMe: !!t.lembrarMe,
  status: t.status ?? "paga",
  tags: t.tags ?? [],
});

/**
 * Converte os valores do formulário (strings do RHF) para o corpo esperado
 * pela API: valor numérico, data em ISO.
 *
 * Campos de ID que a API valida como `uuid` NÃO podem ir como string vazia —
 * o backend responde 500 (`""` não é uuid válido; ele não vira null no POST).
 * Então `id` nunca é enviado (a API gera no POST; no PATCH vem pela URL) e
 * `pessoaId`/`meioPagamentoId` só entram quando preenchidos. O contrato gerado
 * marca esses como obrigatórios, daí o cast final.
 */
export const toRequest = (
  values: TransactionFormValues,
): CreateTransacaoRequest =>
  ({
    descricao: values.descricao,
    categoriaId: values.categoriaId,
    valor: parseAmount(values.valor),
    data: new Date(`${values.data}T12:00:00`).toISOString(),
    lembrarMe: !!values.lembrarMe,
    status: (values.status ?? "paga") as CreateTransacaoRequest.StatusEnum,
    ...(values.pessoaId ? { pessoaId: values.pessoaId } : {}),
    ...(values.meioPagamentoId
      ? { meioPagamentoId: values.meioPagamentoId }
      : {}),
    ...(values.formaPagamento
      ? {
          formaPagamento:
            values.formaPagamento as CreateTransacaoRequest.FormaPagamentoEnum,
        }
      : {}),
    ...(values.observacoes ? { observacoes: values.observacoes } : {}),
    ...(values.tags?.length ? { tags: values.tags } : {}),
  }) as CreateTransacaoRequest;
