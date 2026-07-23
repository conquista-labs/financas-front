import { useQuery } from "@tanstack/react-query";

import type { GetAnalyticsMeiosPagamentoParams } from "@/domain/usecases";
import { makeGetAnalyticsMeiosPagamentoFactory } from "@/main/factories/usecases";

import type { UseGetAnalyticsMeiosPagamentoOptions } from "./useGetAnalyticsMeiosPagamento.types";

export const useGetAnalyticsMeiosPagamento = (
  params: GetAnalyticsMeiosPagamentoParams,
  options?: UseGetAnalyticsMeiosPagamentoOptions,
) => {
  const getAnalyticsMeiosPagamento = makeGetAnalyticsMeiosPagamentoFactory();

  return useQuery({
    queryKey: ["get", "analytics", "meios-pagamento", params.ano, params.mes],
    queryFn: () => getAnalyticsMeiosPagamento.get(params),
    enabled: !!(params.ano && params.mes),
    ...options,
  });
};
