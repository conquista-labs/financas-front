import type {
  AtualizarContaVinculadaRequest,
  AtualizarContaVinculadaResponse,
} from "@/domain/models";

/** PATCH /contas-vinculadas/:id */
export interface PatchContasVinculadasIdUseCase {
  patch: (
    body: PatchContasVinculadasIdRequest,
    params: PatchContasVinculadasIdParams,
  ) => Promise<PatchContasVinculadasIdModel>;
}

export type PatchContasVinculadasIdModel = AtualizarContaVinculadaResponse;
export type PatchContasVinculadasIdRequest = AtualizarContaVinculadaRequest;
export type PatchContasVinculadasIdParams = { id: string };
