import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetCaixaEntradaResumoModel } from "@/domain/usecases";
import { makeGetCaixaEntradaResumoFactory } from "@/main/factories/usecases";

import type { UseGetCaixaEntradaResumoOptions } from "./useGetCaixaEntradaResumo.types";

/** Contadores da caixa de entrada (cards e badge do menu). */
export const useGetCaixaEntradaResumo = (
  options?: UseGetCaixaEntradaResumoOptions,
): UseQueryResult<GetCaixaEntradaResumoModel, unknown> => {
  const getResumo = makeGetCaixaEntradaResumoFactory();

  return useQuery({
    queryKey: ["get-caixa-entrada-resumo"],
    queryFn: async () => {
      try {
        return await getResumo.get();
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
