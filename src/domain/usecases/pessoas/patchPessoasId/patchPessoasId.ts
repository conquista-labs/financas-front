import type { CreatePessoaDto, PessoaResponseDto } from "@/domain/models";

export interface PatchPessoasIdUseCase {
  patch: (
    body: PatchPessoasIdRequest,
    param: PatchPessoasIdParams,
  ) => Promise<PatchPessoasIdModel>;
}

export type PatchPessoasIdModel = PessoaResponseDto;
export type PatchPessoasIdRequest = CreatePessoaDto;
export type PatchPessoasIdParams = { id: string };
