import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetResumoFinanceiroModel } from "@/domain/usecases";
import { makeGetResumoFinanceiroFactory } from "@/main/factories/usecases";

import type { UseGetResumoFinanceiroOptions } from "./useGetResumoFinanceiro.types";

export const useGetResumoFinanceiro = (
  options?: UseGetResumoFinanceiroOptions,
): UseQueryResult<GetResumoFinanceiroModel, unknown> => {
  const getResumoFinanceiro = makeGetResumoFinanceiroFactory();

  return useQuery({
    queryKey: ["get-resumo-financeiro"],
    queryFn: async () => {
      try {
        return await getResumoFinanceiro.get();
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
