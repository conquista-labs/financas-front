import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetResumoFinanceiroModel } from "@/domain/usecases";

export type UseGetResumoFinanceiroOptions = Omit<
  UseQueryOptions<GetResumoFinanceiroModel, unknown, GetResumoFinanceiroModel>,
  "queryKey" | "queryFn"
>;
