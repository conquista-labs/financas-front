import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetResumoFinanceiroModel,
  GetResumoFinanceiroParams,
} from "@/domain/usecases";
import { makeGetResumoFinanceiroFactory } from "@/main/factories/usecases";

import type { UseGetResumoFinanceiroOptions } from "./useGetResumoFinanceiro.types";

export const useGetResumoFinanceiro = (
  params: GetResumoFinanceiroParams,
  options?: UseGetResumoFinanceiroOptions,
): UseQueryResult<GetResumoFinanceiroModel, unknown> => {
  const getResumoFinanceiro = makeGetResumoFinanceiroFactory();

  return useQuery({
    queryKey: ["get-resumo-financeiro", params],
    queryFn: async () => {
      try {
        return await getResumoFinanceiro.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
