import { useQuery } from "@tanstack/react-query";
import { makeGetAnalyticsOrcamentoFactory } from "@/main/factories/usecases";
import { GetAnalyticsOrcamentoParams } from "@/domain/usecases";

export const useGetAnalyticsOrcamento = (
  params: GetAnalyticsOrcamentoParams,
) => {
  const getAnalyticsOrcamento = makeGetAnalyticsOrcamentoFactory();

  return useQuery({
    queryKey: ["get", "analytics", "orcamento", params.ano, params.mes],
    queryFn: () => getAnalyticsOrcamento.get(params),
    enabled: !!(params.ano && params.mes),
  });
};
