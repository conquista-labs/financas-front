import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetCaixaEntradaResumoModel } from "@/domain/usecases";

export type UseGetCaixaEntradaResumoOptions = Omit<
  UseQueryOptions<
    GetCaixaEntradaResumoModel,
    unknown,
    GetCaixaEntradaResumoModel
  >,
  "queryKey" | "queryFn"
>;
