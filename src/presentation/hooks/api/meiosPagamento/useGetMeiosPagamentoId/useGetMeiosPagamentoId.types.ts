import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetMeiosPagamentoIdModel } from "@/domain/usecases";

export type UseGetMeiosPagamentoIdOptions = Omit<
  UseQueryOptions<GetMeiosPagamentoIdModel, unknown, GetMeiosPagamentoIdModel>,
  "queryKey" | "queryFn"
>;
