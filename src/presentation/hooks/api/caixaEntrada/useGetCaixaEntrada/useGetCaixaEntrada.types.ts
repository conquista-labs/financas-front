import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetCaixaEntradaModel } from "@/domain/usecases";

export type UseGetCaixaEntradaOptions = Omit<
  UseQueryOptions<GetCaixaEntradaModel, unknown, GetCaixaEntradaModel>,
  "queryKey" | "queryFn"
>;
