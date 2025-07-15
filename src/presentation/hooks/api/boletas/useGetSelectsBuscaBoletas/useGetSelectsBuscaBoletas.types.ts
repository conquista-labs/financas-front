import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetSelectsBuscaBoletasModel } from "@/domain/usecases";

export type UseGetSelectsBuscaBoletasOptions = Omit<
  UseQueryOptions<
    GetSelectsBuscaBoletasModel,
    unknown,
    GetSelectsBuscaBoletasModel
  >,
  "queryKey" | "queryFn"
>;
