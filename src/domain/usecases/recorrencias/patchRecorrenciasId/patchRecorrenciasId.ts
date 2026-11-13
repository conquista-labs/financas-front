import type {
  EditRecorrenciaRequest,
  RecorrenciaResponse,
} from "@/domain/models";

/** PATCH /recorrencias/:id */
export interface PatchRecorrenciasIdUseCase {
  patch: (
    body: PatchRecorrenciasIdRequest,
    params: PatchRecorrenciasIdParams,
  ) => Promise<PatchRecorrenciasIdModel>;
}

export type PatchRecorrenciasIdModel = RecorrenciaResponse;
export type PatchRecorrenciasIdRequest = EditRecorrenciaRequest;
export type PatchRecorrenciasIdParams = { id: string };
