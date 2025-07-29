import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetPessoasModel, GetPessoasParams } from "@/domain/usecases";
import { makeGetPessoasFactory } from "@/main/factories/usecases";

import type { UseGetPessoasOptions } from "./useGetPessoas.types";
import { DAY_TIME } from "@/app.definitions";

export const useGetPessoas = (
  params: GetPessoasParams,
  options?: UseGetPessoasOptions,
): UseQueryResult<GetPessoasModel, unknown> => {
  const getPessoas = makeGetPessoasFactory();

  return useQuery({
    queryKey: ["get-pessoas", params],
    queryFn: async () => {
      try {
        return await getPessoas.get(params);
      } catch (error) {
        throw error;
      }
    },
    staleTime: DAY_TIME,
    gcTime: DAY_TIME,
    ...options,
  });
};
