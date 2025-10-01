import { GetAnalyticsMeiosPagamentoResponse } from "@/domain/models/getAnalyticsMeiosPagamentoResponse";

export interface GetAnalyticsMeiosPagamentoUsecase {
  get: (
    params: GetAnalyticsMeiosPagamentoParams,
  ) => Promise<GetAnalyticsMeiosPagamentoModel>;
}

export type GetAnalyticsMeiosPagamentoModel =
  GetAnalyticsMeiosPagamentoResponse;

export type GetAnalyticsMeiosPagamentoParams = {
  ano: number;
  mes: number;
};
