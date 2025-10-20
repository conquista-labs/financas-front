import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetQuickStatsModel } from "@/domain/usecases";

export type UseGetQuickStatsOptions = Omit<
  UseQueryOptions<GetQuickStatsModel, unknown, GetQuickStatsModel>,
  "queryKey" | "queryFn"
>;
