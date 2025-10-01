import { useQuery } from "@tanstack/react-query";
import { makeGetAnalyticsTendenciasFactory } from "@/main/factories/usecases";
import { GetAnalyticsTendenciasParams } from "@/domain/usecases";

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
