import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetAnalyticsOrcamentoModel } from "@/domain/usecases";

export type UseGetAnalyticsOrcamentoOptions = Omit<
  UseQueryOptions<
    GetAnalyticsOrcamentoModel,
    unknown,
    GetAnalyticsOrcamentoModel
  >,
  "queryKey" | "queryFn"
>;
