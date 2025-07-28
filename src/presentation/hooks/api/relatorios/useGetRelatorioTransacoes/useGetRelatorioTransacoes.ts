import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetRelatorioTransacoesModel,
  GetRelatorioTransacoesParams,
} from "@/domain/usecases";
import { makeGetRelatorioTransacoesFactory } from "@/main/factories/usecases";

import type { UseGetRelatorioTransacoesOptions } from "./useGetRelatorioTransacoes.types";

export const useGetRelatorioTransacoes = (
  params: GetRelatorioTransacoesParams,
  options?: UseGetRelatorioTransacoesOptions,
): UseQueryResult<GetRelatorioTransacoesModel, unknown> => {
  const getRelatorioTransacoes = makeGetRelatorioTransacoesFactory();

  return useQuery({
    queryKey: ["get-relatorio-transacoes", params],
    queryFn: async () => {
      try {
        return await getRelatorioTransacoes.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
