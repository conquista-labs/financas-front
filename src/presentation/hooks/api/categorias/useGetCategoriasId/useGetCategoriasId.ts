import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetCategoriasIdModel,
  GetCategoriasIdParams,
} from "@/domain/usecases";
import { makeGetCategoriasIdFactory } from "@/main/factories/usecases";

import type { UseGetCategoriasIdOptions } from "./useGetCategoriasId.types";

export const useGetCategoriasId = (
  params: GetCategoriasIdParams,
  options?: UseGetCategoriasIdOptions,
): UseQueryResult<GetCategoriasIdModel, unknown> => {
  const getCategoriasId = makeGetCategoriasIdFactory();

  return useQuery({
    queryKey: ["get-categoria", params],
    queryFn: async () => {
      try {
        return await getCategoriasId.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
