import type { GetRelatorioTransacoesResponse } from "@/domain/models";

export interface GetRelatorioTransacoesUseCase {
  get: (
    params: GetRelatorioTransacoesParams,
  ) => Promise<GetRelatorioTransacoesModel>;
}

export type GetRelatorioTransacoesModel = GetRelatorioTransacoesResponse;

export type GetRelatorioTransacoesParams = {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};
