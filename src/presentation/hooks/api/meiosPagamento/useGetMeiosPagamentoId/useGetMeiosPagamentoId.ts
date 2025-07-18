import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  GetMeiosPagamentoIdModel,
  GetMeiosPagamentoIdParams,
} from "@/domain/usecases";
import { makeGetMeiosPagamentoIdFactory } from "@/main/factories/usecases";

import type { UseGetMeiosPagamentoIdOptions } from "./useGetMeiosPagamentoId.types";

export const useGetMeiosPagamentoId = (
  params: GetMeiosPagamentoIdParams,
  options?: UseGetMeiosPagamentoIdOptions,
): UseQueryResult<GetMeiosPagamentoIdModel, unknown> => {
  const getMeiosPagamentoId = makeGetMeiosPagamentoIdFactory();

  return useQuery({
    queryKey: ["get-meios-pagamento", params],
    queryFn: async () => {
      try {
        return await getMeiosPagamentoId.get(params);
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
