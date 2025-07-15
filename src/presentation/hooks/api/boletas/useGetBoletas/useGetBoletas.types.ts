import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetBoletasModel } from "@/domain/usecases";

export type UseGetBoletasOptions = Omit<
  UseQueryOptions<GetBoletasModel, unknown, GetBoletasModel>,
  "queryKey" | "queryFn"
>;
