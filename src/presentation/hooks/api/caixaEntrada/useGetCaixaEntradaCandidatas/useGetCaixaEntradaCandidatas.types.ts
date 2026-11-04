import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetCaixaEntradaCandidatasModel } from "@/domain/usecases";

export type UseGetCaixaEntradaCandidatasOptions = Omit<
  UseQueryOptions<
    GetCaixaEntradaCandidatasModel,
    unknown,
    GetCaixaEntradaCandidatasModel
  >,
  "queryKey" | "queryFn"
>;
