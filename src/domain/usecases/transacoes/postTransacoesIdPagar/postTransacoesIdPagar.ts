import type { EditTransacaoResponse } from "@/domain/models";

/** POST /transacoes/{id}/pagar — marca a transação como paga (registra pagaEm). */
export interface PostTransacoesIdPagarUseCase {
  pagar: (
    param: PostTransacoesIdPagarParams,
  ) => Promise<PostTransacoesIdPagarModel>;
}

export type PostTransacoesIdPagarModel = EditTransacaoResponse;
export type PostTransacoesIdPagarParams = { id: string };
