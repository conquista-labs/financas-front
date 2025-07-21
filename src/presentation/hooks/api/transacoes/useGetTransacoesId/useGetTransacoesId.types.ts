import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetTransacoesIdModel } from "@/domain/usecases";

export type UseGetTransacoesIdOptions = Omit<
  UseQueryOptions<GetTransacoesIdModel, unknown, GetTransacoesIdModel>,
  "queryKey" | "queryFn"
>;
