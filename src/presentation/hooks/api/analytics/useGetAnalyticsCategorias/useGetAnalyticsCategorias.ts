import { useQuery } from "@tanstack/react-query";
import { makeGetAnalyticsCategoriasFactory } from "@/main/factories/usecases";
import { GetAnalyticsCategoriasParams } from "@/domain/usecases";

export const useGetAnalyticsCategorias = (
  params: GetAnalyticsCategoriasParams,
) => {
  const getAnalyticsCategorias = makeGetAnalyticsCategoriasFactory();

  return useQuery({
    queryKey: ["get", "analytics", "categorias", params.ano, params.mes],
    queryFn: () => getAnalyticsCategorias.get(params),
    enabled: !!(params.ano && params.mes),
  });
};
