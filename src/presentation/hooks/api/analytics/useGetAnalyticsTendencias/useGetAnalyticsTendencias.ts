import { useQuery } from "@tanstack/react-query";

import type { GetAnalyticsTendenciasParams } from "@/domain/usecases";
import { makeGetAnalyticsTendenciasFactory } from "@/main/factories/usecases";

export const useGetAnalyticsTendencias = (
  params: GetAnalyticsTendenciasParams,
) => {
  const getAnalyticsTendencias = makeGetAnalyticsTendenciasFactory();

  return useQuery({
    queryKey: ["get", "analytics", "tendencias", params.ano, params.mes],
    queryFn: () => getAnalyticsTendencias.get(params),
    enabled: !!(params.ano && params.mes),
  });
};
