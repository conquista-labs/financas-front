import type { GetResumoFinanceiroResponse } from "@/domain/models";

export interface GetResumoFinanceiroUseCase {
  get: () => Promise<GetResumoFinanceiroModel>;
}

export type GetResumoFinanceiroModel = GetResumoFinanceiroResponse;
