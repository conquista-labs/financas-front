import type { GetCaixaEntradaResumoResponse } from "@/domain/models";

/** GET /caixa-entrada/resumo — contadores da caixa de entrada. */
export interface GetCaixaEntradaResumoUseCase {
  get: () => Promise<GetCaixaEntradaResumoModel>;
}

export type GetCaixaEntradaResumoModel = GetCaixaEntradaResumoResponse;
