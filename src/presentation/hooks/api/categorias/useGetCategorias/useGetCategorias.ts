import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetCategoriasModel,
  GetCategoriasParams,
} from "@/domain/usecases";
import { makeGetCategoriasFactory } from "@/main/factories/usecases";

import type { UseGetCategoriasOptions } from "./useGetCategorias.types";

export const useGetCategorias = (
  params: GetCategoriasParams,
  options?: UseGetCategoriasOptions,
): UseQueryResult<GetCategoriasModel, unknown> => {
  const getCategorias = makeGetCategoriasFactory();

  return useQuery({
    queryKey: ["get-categorias", params],
    queryFn: async () => {
      try {
        return await getCategorias.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
