import type { GetPessoasResponse } from "@/domain/models";

export interface GetPessoasUseCase {
  get: (params: GetPessoasParams) => Promise<GetPessoasModel>;
}

export type GetPessoasModel = GetPessoasResponse;

export type GetPessoasParams = {
  page?: number;
  limit?: number;
};
