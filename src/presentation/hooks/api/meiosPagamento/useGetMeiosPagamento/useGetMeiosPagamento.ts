import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetMeiosPagamentoModel,
  GetMeiosPagamentoParams,
} from "@/domain/usecases";
import { makeGetMeiosPagamentoFactory } from "@/main/factories/usecases";

import type { UseGetMeiosPagamentoOptions } from "./useGetMeiosPagamento.types";

export const useGetMeiosPagamento = (
  params: GetMeiosPagamentoParams,
  options?: UseGetMeiosPagamentoOptions,
): UseQueryResult<GetMeiosPagamentoModel, unknown> => {
  const getMeiosPagamento = makeGetMeiosPagamentoFactory();

  return useQuery({
    queryKey: ["get-meios-pagamento", params],
    queryFn: async () => {
      try {
        return await getMeiosPagamento.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
