import type { EditPessoaRequest, EditPessoaResponse } from "@/domain/models";

export interface PatchPessoasIdUseCase {
  patch: (
    body: PatchPessoasIdRequest,
    param: PatchPessoasIdParams,
  ) => Promise<PatchPessoasIdModel>;
}

export type PatchPessoasIdModel = EditPessoaResponse;
export type PatchPessoasIdRequest = EditPessoaRequest;
export type PatchPessoasIdParams = { id: string };
