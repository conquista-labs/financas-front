import { GetAnalyticsOrcamentoResponse } from "@/domain/models/getAnalyticsOrcamentoResponse";

export interface GetAnalyticsOrcamentoUsecase {
  get: (
    params: GetAnalyticsOrcamentoParams,
  ) => Promise<GetAnalyticsOrcamentoModel>;
}

export type GetAnalyticsOrcamentoModel = GetAnalyticsOrcamentoResponse;

export type GetAnalyticsOrcamentoParams = {
  ano: number;
  mes: number;
};
