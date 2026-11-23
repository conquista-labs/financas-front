/**
 * POST /transacoes/pagar-lote — marca várias contas pendentes como pagas:
 * as escolhidas (`ids`) e/ou todas que vencem até `ate` (AAAA-MM-DD, inclusive).
 */
export interface PostTransacoesPagarLoteUseCase {
  pagarLote: (
    body: PostTransacoesPagarLoteParams,
  ) => Promise<PostTransacoesPagarLoteModel>;
}

export type PostTransacoesPagarLoteParams = { ids?: string[]; ate?: string };
export type PostTransacoesPagarLoteModel = {
  message?: string;
  data?: { pagas: number };
};
