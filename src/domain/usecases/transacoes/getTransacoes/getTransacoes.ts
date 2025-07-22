import type { GetTransacoesResponse } from "@/domain/models";

export interface GetTransacoesUseCase {
  get: (params: GetTransacoesParams) => Promise<GetTransacoesModel>;
}

export type GetTransacoesModel = GetTransacoesResponse;

export type GetTransacoesParams = {
  page?: number;
  limit?: number;
  date?: string;
};
