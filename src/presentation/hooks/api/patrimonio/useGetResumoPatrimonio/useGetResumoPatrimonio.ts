import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetResumoPatrimonioModel,
  GetResumoPatrimonioParams,
} from "@/domain/usecases";
import { makeGetResumoPatrimonioFactory } from "@/main/factories/usecases";

import type { UseGetResumoPatrimonioOptions } from "./useGetResumoPatrimonio.types";

export const useGetResumoPatrimonio = (
  params?: GetResumoPatrimonioParams,
  options?: UseGetResumoPatrimonioOptions,
): UseQueryResult<GetResumoPatrimonioModel, unknown> => {
  const getResumoPatrimonio = makeGetResumoPatrimonioFactory();

  return useQuery({
    queryKey: ["get-resumo-patrimonio", params],
    queryFn: async () => {
      try {
        return await getResumoPatrimonio.get(params || {});
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
