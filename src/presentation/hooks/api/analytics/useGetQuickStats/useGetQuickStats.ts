import { useQuery } from "@tanstack/react-query";

import type { GetQuickStatsParams } from "@/domain/usecases";
import { makeGetQuickStatsFactory } from "@/main/factories/usecases";

import type { UseGetQuickStatsOptions } from "./useGetQuickStats.types";

export const useGetQuickStats = (
  params: GetQuickStatsParams,
  options?: UseGetQuickStatsOptions,
) => {
  const getQuickStats = makeGetQuickStatsFactory();

  return useQuery({
    queryKey: ["get", "analytics", "quick-stats", params.ano, params.mes],
    queryFn: () => getQuickStats.get(params),
    enabled: !!(params.ano && params.mes),
    ...options,
  });
};
