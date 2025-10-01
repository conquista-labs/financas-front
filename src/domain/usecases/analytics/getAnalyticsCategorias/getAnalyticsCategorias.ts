import { GetAnalyticsCategoriasResponse } from "@/domain/models/getAnalyticsCategoriasResponse";

export interface GetAnalyticsCategoriasUsecase {
  get: (
    params: GetAnalyticsCategoriasParams,
  ) => Promise<GetAnalyticsCategoriasModel>;
}

export type GetAnalyticsCategoriasModel = GetAnalyticsCategoriasResponse;

export type GetAnalyticsCategoriasParams = {
  ano: number;
  mes: number;
  limit?: number;
};
