import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetTransacoesIdModel,
  GetTransacoesIdParams,
} from "@/domain/usecases";
import { makeGetTransacoesIdFactory } from "@/main/factories/usecases";

import type { UseGetTransacoesIdOptions } from "./useGetTransacoesId.types";

export const useGetTransacoesId = (
  params: GetTransacoesIdParams,
  options?: UseGetTransacoesIdOptions,
): UseQueryResult<GetTransacoesIdModel, unknown> => {
  const getTransacoesId = makeGetTransacoesIdFactory();

  return useQuery({
    queryKey: ["get-pessoa", params],
    queryFn: async () => {
      try {
        return await getTransacoesId.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
