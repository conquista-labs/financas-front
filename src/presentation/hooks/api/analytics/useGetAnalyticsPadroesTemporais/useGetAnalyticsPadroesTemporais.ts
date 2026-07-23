import { useQuery } from "@tanstack/react-query";

import type { GetAnalyticsPadroesTemporaisParams } from "@/domain/usecases";
import { makeGetAnalyticsPadroesTemporaisFactory } from "@/main/factories/usecases";

export const useGetAnalyticsPadroesTemporais = (
  params: GetAnalyticsPadroesTemporaisParams,
) => {
  const getAnalyticsPadroesTemporais =
    makeGetAnalyticsPadroesTemporaisFactory();

  return useQuery({
    queryKey: ["get", "analytics", "padroes-temporais", params.ano, params.mes],
    queryFn: () => getAnalyticsPadroesTemporais.get(params),
    enabled: !!(params.ano && params.mes),
  });
};
