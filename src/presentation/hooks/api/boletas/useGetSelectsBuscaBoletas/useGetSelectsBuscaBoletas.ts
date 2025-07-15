import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetSelectsBuscaBoletasModel } from "@/domain/usecases";
import { makeGetSelectsBuscaBoletasFactory } from "@/main/factories/usecases";

import type { UseGetSelectsBuscaBoletasOptions } from "./useGetSelectsBuscaBoletas.types";

export const useGetSelectsBuscaBoletas = (
  options?: UseGetSelectsBuscaBoletasOptions,
): UseQueryResult<GetSelectsBuscaBoletasModel, unknown> => {
  const getSelectsBuscaBoletas = makeGetSelectsBuscaBoletasFactory();

  return useQuery({
    queryKey: ["get-selects-busca-boletas"],
    queryFn: async () => {
      try {
        return await getSelectsBuscaBoletas.get();
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
