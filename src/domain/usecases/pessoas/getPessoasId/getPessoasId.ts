import type { PessoaResponseDto } from "@/domain/models";

export interface GetPessoasIdUseCase {
  get: (params: GetPessoasIdParams) => Promise<GetPessoasIdModel>;
}

export type GetPessoasIdModel = PessoaResponseDto;

export type GetPessoasIdParams = {
  id: string;
};
