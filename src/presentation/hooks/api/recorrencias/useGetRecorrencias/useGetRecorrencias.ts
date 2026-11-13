import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetRecorrenciasModel } from "@/domain/usecases";
import { makeGetRecorrenciasFactory } from "@/main/factories/usecases";

/** Contas recorrentes (ativas e pausadas). */
export const useGetRecorrencias = (): UseQueryResult<
  GetRecorrenciasModel,
  unknown
> => {
  const getRecorrencias = makeGetRecorrenciasFactory();
  return useQuery({
    queryKey: ["get-recorrencias"],
    queryFn: () => getRecorrencias.get(),
  });
};
