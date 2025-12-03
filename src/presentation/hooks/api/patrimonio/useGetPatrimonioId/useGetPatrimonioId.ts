import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetPatrimonioIdModel,
  GetPatrimonioIdParams,
} from "@/domain/usecases";
import { makeGetPatrimonioIdFactory } from "@/main/factories/usecases";

import type { UseGetPatrimonioIdOptions } from "./useGetPatrimonioId.types";

export const useGetPatrimonioId = (
  params: GetPatrimonioIdParams,
  options?: UseGetPatrimonioIdOptions,
): UseQueryResult<GetPatrimonioIdModel, unknown> => {
  const getPatrimonioId = makeGetPatrimonioIdFactory();

  return useQuery({
    queryKey: ["get-patrimonio", params],
    queryFn: async () => {
      try {
        return await getPatrimonioId.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
