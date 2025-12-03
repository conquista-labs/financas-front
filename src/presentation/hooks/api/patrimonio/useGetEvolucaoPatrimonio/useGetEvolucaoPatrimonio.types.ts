import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetEvolucaoPatrimonioModel } from "@/domain/usecases";

export type UseGetEvolucaoPatrimonioOptions = Omit<
  UseQueryOptions<
    GetEvolucaoPatrimonioModel,
    unknown,
    GetEvolucaoPatrimonioModel
  >,
  "queryKey" | "queryFn"
>;
