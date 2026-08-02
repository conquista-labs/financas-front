import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetMetasModel, GetMetasParams } from "@/domain/usecases";
import { makeGetMetasFactory } from "@/main/factories/usecases";

import type { UseGetMetasOptions } from "./useGetMetas.types";

export const useGetMetas = (
  params?: GetMetasParams,
  options?: UseGetMetasOptions,
): UseQueryResult<GetMetasModel, unknown> => {
  const getMetas = makeGetMetasFactory();

  return useQuery({
    queryKey: ["get-metas", params],
    queryFn: async () => {
      try {
        return await getMetas.get(params || {});
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
