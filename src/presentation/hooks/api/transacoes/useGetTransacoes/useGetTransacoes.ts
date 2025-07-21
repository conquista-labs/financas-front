import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetTransacoesModel,
  GetTransacoesParams,
} from "@/domain/usecases";
import { makeGetTransacoesFactory } from "@/main/factories/usecases";

import type { UseGetTransacoesOptions } from "./useGetTransacoes.types";

export const useGetTransacoes = (
  params: GetTransacoesParams,
  options?: UseGetTransacoesOptions,
): UseQueryResult<GetTransacoesModel, unknown> => {
  const getTransacoes = makeGetTransacoesFactory();

  return useQuery({
    queryKey: ["get-Transacoes", params],
    queryFn: async () => {
      try {
        return await getTransacoes.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
