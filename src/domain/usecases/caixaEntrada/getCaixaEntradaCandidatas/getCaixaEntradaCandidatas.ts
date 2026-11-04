import type { GetCaixaEntradaCandidatasResponse } from "@/domain/models";

/** GET /caixa-entrada/:id/candidatas — "Já lancei": transações que podem ser este lançamento. */
export interface GetCaixaEntradaCandidatasUseCase {
  get: (params: GetCaixaEntradaCandidatasParams) => Promise<GetCaixaEntradaCandidatasModel>;
}

export type GetCaixaEntradaCandidatasModel = GetCaixaEntradaCandidatasResponse;

export type GetCaixaEntradaCandidatasParams = { id: string };
