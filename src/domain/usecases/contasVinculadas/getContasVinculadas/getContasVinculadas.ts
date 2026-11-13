import type { GetContasVinculadasResponse } from "@/domain/models";

/** GET /contas-vinculadas */
export interface GetContasVinculadasUseCase {
  get: () => Promise<GetContasVinculadasModel>;
}

export type GetContasVinculadasModel = GetContasVinculadasResponse;
