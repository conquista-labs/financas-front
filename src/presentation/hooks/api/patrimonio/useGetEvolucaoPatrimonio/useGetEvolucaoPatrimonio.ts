import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetEvolucaoPatrimonioModel,
  GetEvolucaoPatrimonioParams,
} from "@/domain/usecases";
import { makeGetEvolucaoPatrimonioFactory } from "@/main/factories/usecases";

import type { UseGetEvolucaoPatrimonioOptions } from "./useGetEvolucaoPatrimonio.types";

export const useGetEvolucaoPatrimonio = (
  params: GetEvolucaoPatrimonioParams,
  options?: UseGetEvolucaoPatrimonioOptions,
): UseQueryResult<GetEvolucaoPatrimonioModel, unknown> => {
  const getEvolucaoPatrimonio = makeGetEvolucaoPatrimonioFactory();

  return useQuery({
    queryKey: ["get-evolucao-patrimonio", params],
    queryFn: async () => {
      try {
        return await getEvolucaoPatrimonio.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
