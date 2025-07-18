import type { GetMeiosPagamentosResponse } from "@/domain/models";

export interface GetMeiosPagamentoUseCase {
  get: (params: GetMeiosPagamentoParams) => Promise<GetMeiosPagamentoModel>;
}

export type GetMeiosPagamentoModel = GetMeiosPagamentoResponse;

export type GetMeiosPagamentoParams = {
  page?: number;
  limit?: number;
};
