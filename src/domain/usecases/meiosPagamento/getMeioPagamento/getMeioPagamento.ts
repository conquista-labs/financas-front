import type { GetMeiosPagamentosResponse } from "@/domain/models";

export interface GetMeiosPagamentoUseCase {
  get: (params: GetMeiosPagamentoParams) => Promise<GetMeiosPagamentoModel>;
}

export type GetMeiosPagamentoModel = GetMeiosPagamentosResponse;

export type GetMeiosPagamentoParams = {
  page?: number;
  limit?: number;
};
