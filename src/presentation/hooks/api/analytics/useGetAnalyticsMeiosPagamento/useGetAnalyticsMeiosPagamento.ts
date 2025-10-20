import { useQuery } from "@tanstack/react-query";
import { makeGetAnalyticsMeiosPagamentoFactory } from "@/main/factories/usecases";
import { GetAnalyticsMeiosPagamentoParams } from "@/domain/usecases";
import { UseGetAnalyticsMeiosPagamentoOptions } from "./useGetAnalyticsMeiosPagamento.types";

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
