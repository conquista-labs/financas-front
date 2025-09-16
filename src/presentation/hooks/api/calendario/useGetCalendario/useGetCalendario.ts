import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetCalendarioModel,
  GetCalendarioParams,
} from "@/domain/usecases";
import { makeGetCalendarioFactory } from "@/main/factories/usecases";

import type { UseGetCalendarioOptions } from "./useGetCalendario.types";

export const useGetCalendario = (
  params: GetCalendarioParams,
  options?: UseGetCalendarioOptions,
): UseQueryResult<GetCalendarioModel, unknown> => {
  const getCalendario = makeGetCalendarioFactory();

  return useQuery({
    queryKey: ["get-calendario", params],
    queryFn: async () => {
      try {
        return await getCalendario.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
