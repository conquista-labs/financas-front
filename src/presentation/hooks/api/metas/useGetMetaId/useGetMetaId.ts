import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetMetaIdModel, GetMetaIdParams } from "@/domain/usecases";
import { makeGetMetaIdFactory } from "@/main/factories/usecases";

import type { UseGetMetaIdOptions } from "./useGetMetaId.types";

export const useGetMetaId = (
  params: GetMetaIdParams,
  options?: UseGetMetaIdOptions,
): UseQueryResult<GetMetaIdModel, unknown> => {
  const getMetaId = makeGetMetaIdFactory();

  return useQuery({
    queryKey: ["get-meta", params],
    queryFn: async () => {
      try {
        return await getMetaId.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
