import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import type {
  GetCaixaEntradaModel,
  GetCaixaEntradaParams,
} from "@/domain/usecases";
import { makeGetCaixaEntradaFactory } from "@/main/factories/usecases";

import type { UseGetCaixaEntradaOptions } from "./useGetCaixaEntrada.types";

/** Lançamentos sincronizados dos bancos (pendentes de revisão ou ignorados). */
export const useGetCaixaEntrada = (
  params: GetCaixaEntradaParams,
  options?: UseGetCaixaEntradaOptions,
): UseQueryResult<GetCaixaEntradaModel, unknown> => {
  const getCaixaEntrada = makeGetCaixaEntradaFactory();

  return useQuery({
    queryKey: ["get-caixa-entrada", params],
    queryFn: async () => {
      try {
        return await getCaixaEntrada.get(params);
      } catch (error) {
        throw error;
      }
    },
    // Trocar filtro/página não pisca a lista vazia.
    placeholderData: keepPreviousData,
    ...options,
  });
};
