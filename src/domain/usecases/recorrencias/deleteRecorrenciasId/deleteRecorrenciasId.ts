import type { DeleteRecorrenciaResponse } from "@/domain/models";

/** DELETE /recorrencias/:id */
export interface DeleteRecorrenciasIdUseCase {
  delete: (
    params: DeleteRecorrenciasIdParams,
  ) => Promise<DeleteRecorrenciasIdModel>;
}

export type DeleteRecorrenciasIdModel = DeleteRecorrenciaResponse;
export type DeleteRecorrenciasIdParams = { id: string };
