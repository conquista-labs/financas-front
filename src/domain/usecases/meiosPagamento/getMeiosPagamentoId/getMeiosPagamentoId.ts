import type { GetMeioPagamentoResponse } from "@/domain/models";

export interface GetMeiosPagamentoIdUseCase {
  get: (params: GetMeiosPagamentoIdParams) => Promise<GetMeiosPagamentoIdModel>;
}

export type GetMeiosPagamentoIdModel = GetMeioPagamentoResponse;

export type GetMeiosPagamentoIdParams = {
  id: string;
};
