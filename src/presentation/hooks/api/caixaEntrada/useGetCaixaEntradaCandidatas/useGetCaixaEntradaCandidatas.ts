import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetCaixaEntradaCandidatasModel } from "@/domain/usecases";
import { makeGetCaixaEntradaCandidatasFactory } from "@/main/factories/usecases";

import type { UseGetCaixaEntradaCandidatasOptions } from "./useGetCaixaEntradaCandidatas.types";

/** "Já lancei": transações que podem ser o lançamento `id` da caixa. */
export const useGetCaixaEntradaCandidatas = (
  id: string,
  options?: UseGetCaixaEntradaCandidatasOptions,
): UseQueryResult<GetCaixaEntradaCandidatasModel, unknown> => {
  const getCandidatas = makeGetCaixaEntradaCandidatasFactory();

  return useQuery({
    queryKey: ["get-caixa-entrada-candidatas", id],
    queryFn: async () => {
      try {
        return await getCandidatas.get({ id });
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
