import type { GetPessoaResponse } from "@/domain/models";

export interface GetPessoasIdUseCase {
  get: (params: GetPessoasIdParams) => Promise<GetPessoasIdModel>;
}

export type GetPessoasIdModel = GetPessoaResponse;

export type GetPessoasIdParams = {
  id: string;
};
