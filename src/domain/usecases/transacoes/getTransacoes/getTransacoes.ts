import type { GetTransacoesResponse } from "@/domain/models";

export interface GetTransacoesUseCase {
  get: (params: GetTransacoesParams) => Promise<GetTransacoesModel>;
}

export type GetTransacoesModel = GetTransacoesResponse;

/**
 * Params de query do GET /transacoes. Escritos à mão (o gerador OpenAPI só
 * cria models, não os params de use case); nomes conforme o swagger.yaml.
 */
export type GetTransacoesParams = {
  page?: number;
  limit?: number;
  /** Busca textual (descrição). */
  search?: string;
  /** Período (ISO) — filtram o mês. */
  startDate?: string;
  endDate?: string;
  categoriaId?: string;
  pessoaId?: string;
  pessoaIds?: string[];
  meioPagamentoId?: string;
  formaPagamento?: string;
  /** Tipo (despesa/receita). O swagger define como string livre. */
  tipo?: string;
  /** Status da conta: pendente | paga | atrasada (contas a pagar). */
  status?: string;
  /** Tags (a API aceita nome único ou lista de ids). */
  tag?: string;
  tagIds?: string[];
};
