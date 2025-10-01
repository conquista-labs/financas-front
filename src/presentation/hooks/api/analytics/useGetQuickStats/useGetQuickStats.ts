import { useQuery } from "@tanstack/react-query";
import { makeGetQuickStatsFactory } from "@/main/factories/usecases";
import { GetQuickStatsParams } from "@/domain/usecases";

export const useGetQuickStats = (params: GetQuickStatsParams) => {
  const getQuickStats = makeGetQuickStatsFactory();

  return useQuery({
    queryKey: ["get", "analytics", "quick-stats", params.ano, params.mes],
    queryFn: () => getQuickStats.get(params),
    enabled: !!(params.ano && params.mes),
  });
};
