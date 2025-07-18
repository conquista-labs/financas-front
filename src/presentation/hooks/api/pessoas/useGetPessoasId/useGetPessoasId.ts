import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetPessoasIdModel, GetPessoasIdParams } from "@/domain/usecases";
import { makeGetPessoasIdFactory } from "@/main/factories/usecases";

import type { UseGetPessoasIdOptions } from "./useGetPessoasId.types";

export const useGetPessoasId = (
  params: GetPessoasIdParams,
  options?: UseGetPessoasIdOptions,
): UseQueryResult<GetPessoasIdModel, unknown> => {
  const getPessoasId = makeGetPessoasIdFactory();

  return useQuery({
    queryKey: ["get-pessoa", params],
    queryFn: async () => {
      try {
        return await getPessoasId.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
