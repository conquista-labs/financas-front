import { useQuery } from "@tanstack/react-query";
import { makeGetAnalyticsOrcamentoFactory } from "@/main/factories/usecases";
import { GetAnalyticsOrcamentoParams } from "@/domain/usecases";
import { UseGetAnalyticsOrcamentoOptions } from "./useGetAnalyticsOrcamento.types";

export const useGetAnalyticsOrcamento = (
  params: GetAnalyticsOrcamentoParams,
  options?: UseGetAnalyticsOrcamentoOptions,
) => {
  const getAnalyticsOrcamento = makeGetAnalyticsOrcamentoFactory();

  return useQuery({
    queryKey: ["get", "analytics", "orcamento", params.ano, params.mes],
    queryFn: () => getAnalyticsOrcamento.get(params),
    enabled: !!(params.ano && params.mes),
    ...options,
  });
};
