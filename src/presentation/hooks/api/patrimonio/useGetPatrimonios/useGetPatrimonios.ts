import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetPatrimoniosModel,
  GetPatrimoniosParams,
} from "@/domain/usecases";
import { makeGetPatrimoniosFactory } from "@/main/factories/usecases";

import type { UseGetPatrimoniosOptions } from "./useGetPatrimonios.types";

export const useGetPatrimonios = (
  params?: GetPatrimoniosParams,
  options?: UseGetPatrimoniosOptions,
): UseQueryResult<GetPatrimoniosModel, unknown> => {
  const getPatrimonios = makeGetPatrimoniosFactory();

  return useQuery({
    queryKey: ["get-patrimonios", params],
    queryFn: async () => {
      try {
        return await getPatrimonios.get(params || {});
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
