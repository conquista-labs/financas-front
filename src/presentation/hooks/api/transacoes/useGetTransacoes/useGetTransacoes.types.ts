import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetTransacoesModel } from "@/domain/usecases";

export type UseGetTransacoesOptions = Omit<
  UseQueryOptions<GetTransacoesModel, unknown, GetTransacoesModel>,
  "queryKey" | "queryFn"
>;
