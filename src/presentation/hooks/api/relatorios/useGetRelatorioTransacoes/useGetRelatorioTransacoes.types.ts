import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetRelatorioTransacoesModel } from "@/domain/usecases";

export type UseGetRelatorioTransacoesOptions = Omit<
  UseQueryOptions<
    GetRelatorioTransacoesModel,
    unknown,
    GetRelatorioTransacoesModel
  >,
  "queryKey" | "queryFn"
>;
