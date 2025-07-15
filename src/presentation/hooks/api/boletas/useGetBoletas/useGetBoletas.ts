import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetBoletasModel, GetBoletasParams } from "@/domain/usecases";
import { makeBoletasFactory } from "@/main/factories/usecases";

import type { UseGetBoletasOptions } from "./useGetBoletas.types";

export const useGetBoletas = (
  params: GetBoletasParams,
  options?: UseGetBoletasOptions,
): UseQueryResult<GetBoletasModel, unknown> => {
  const getBoletas = makeBoletasFactory();

  return useQuery({
    queryKey: ["get-boletas", params],
    queryFn: async () => {
      try {
        return await getBoletas.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
