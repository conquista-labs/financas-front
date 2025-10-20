import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetAnalyticsMeiosPagamentoModel } from "@/domain/usecases";

export type UseGetAnalyticsMeiosPagamentoOptions = Omit<
  UseQueryOptions<
    GetAnalyticsMeiosPagamentoModel,
    unknown,
    GetAnalyticsMeiosPagamentoModel
  >,
  "queryKey" | "queryFn"
>;
