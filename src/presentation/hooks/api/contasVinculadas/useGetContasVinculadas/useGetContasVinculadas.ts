import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetContasVinculadasModel } from "@/domain/usecases";
import { makeGetContasVinculadasFactory } from "@/main/factories/usecases";

/** Contas dos bancos ligadas pelo Pluggy (titular, meio, corte, ativa). */
export const useGetContasVinculadas = (): UseQueryResult<
  GetContasVinculadasModel,
  unknown
> => {
  const getContas = makeGetContasVinculadasFactory();
  return useQuery({
    queryKey: ["get-contas-vinculadas"],
    queryFn: () => getContas.get(),
  });
};
