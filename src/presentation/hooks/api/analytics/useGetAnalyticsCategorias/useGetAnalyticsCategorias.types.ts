import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetAnalyticsCategoriasModel } from "@/domain/usecases";

export type UseGetAnalyticsCategoriasOptions = Omit<
  UseQueryOptions<
    GetAnalyticsCategoriasModel,
    unknown,
    GetAnalyticsCategoriasModel
  >,
  "queryKey" | "queryFn"
>;
