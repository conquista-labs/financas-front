import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetTransacoesModel,
  GetTransacoesParams,
} from "@/domain/usecases";
import { makeGetTransacoesFactory } from "@/main/factories/usecases";

import type { UseGetTransacoesOptions } from "./useGetTransacoes.types";
import { DAY_TIME } from "@/app.definitions";

export const useGetTransacoes = (
  params: GetTransacoesParams,
  options?: UseGetTransacoesOptions,
): UseQueryResult<GetTransacoesModel, unknown> => {
  const getTransacoes = makeGetTransacoesFactory();

  return useQuery({
    queryKey: ["get-transacoes", params],
    queryFn: async () => {
      try {
        return await getTransacoes.get(params);
      } catch (error) {
        throw error;
      }
    },
    staleTime: DAY_TIME,
    gcTime: DAY_TIME,
    ...options,
  });
};
