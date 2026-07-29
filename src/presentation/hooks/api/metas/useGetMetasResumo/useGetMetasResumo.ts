import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetMetasResumoModel } from "@/domain/usecases";
import { makeGetMetasResumoFactory } from "@/main/factories/usecases";

import type { UseGetMetasResumoOptions } from "./useGetMetasResumo.types";

export const useGetMetasResumo = (
  options?: UseGetMetasResumoOptions,
): UseQueryResult<GetMetasResumoModel, unknown> => {
  const getMetasResumo = makeGetMetasResumoFactory();

  return useQuery({
    queryKey: ["get-metas-resumo"],
    queryFn: async () => {
      try {
        return await getMetasResumo.get();
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
