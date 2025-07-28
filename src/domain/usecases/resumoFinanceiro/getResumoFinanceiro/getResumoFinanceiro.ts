import type { GetResumoFinanceiroResponse } from "@/domain/models";

export interface GetResumoFinanceiroUseCase {
  get: (params: GetResumoFinanceiroParams) => Promise<GetResumoFinanceiroModel>;
}

export type GetResumoFinanceiroModel = GetResumoFinanceiroResponse;
export type GetResumoFinanceiroParams = {
  ano: number;
};
