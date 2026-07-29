import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetDesejosModel, GetDesejosParams } from "@/domain/usecases";
import { makeGetDesejosFactory } from "@/main/factories/usecases";

import type { UseGetDesejosOptions } from "./useGetDesejos.types";

export const useGetDesejos = (
  params?: GetDesejosParams,
  options?: UseGetDesejosOptions,
): UseQueryResult<GetDesejosModel, unknown> => {
  const getDesejos = makeGetDesejosFactory();

  return useQuery({
    queryKey: ["get-desejos", params],
    queryFn: async () => {
      try {
        return await getDesejos.get(params || {});
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
