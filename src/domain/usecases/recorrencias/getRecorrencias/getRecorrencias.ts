import type { GetRecorrenciasResponse } from "@/domain/models";

/** GET /recorrencias */
export interface GetRecorrenciasUseCase {
  get: () => Promise<GetRecorrenciasModel>;
}

export type GetRecorrenciasModel = GetRecorrenciasResponse;
