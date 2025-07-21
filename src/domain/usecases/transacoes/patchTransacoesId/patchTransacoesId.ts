import type {
  EditTransacaoRequest,
  EditTransacaoResponse,
} from "@/domain/models";

export interface PatchTransacoesIdUseCase {
  patch: (
    body: PatchTransacoesIdRequest,
    param: PatchTransacoesIdParams,
  ) => Promise<PatchTransacoesIdModel>;
}

export type PatchTransacoesIdModel = EditTransacaoResponse;
export type PatchTransacoesIdRequest = EditTransacaoRequest;
export type PatchTransacoesIdParams = { id: string };
