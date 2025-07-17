import type { PessoaResponseDto } from "@/domain/models";

export interface DeletePessoasIdUseCase {
  delete: (param: DeletePessoasIdParams) => Promise<DeletePessoasIdModel>;
}

export type DeletePessoasIdModel = PessoaResponseDto;
export type DeletePessoasIdParams = { id: string };
