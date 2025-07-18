import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetMeiosPagamentoModel } from "@/domain/usecases";

export type UseGetMeiosPagamentoOptions = Omit<
  UseQueryOptions<GetMeiosPagamentoModel, unknown, GetMeiosPagamentoModel>,
  "queryKey" | "queryFn"
>;
