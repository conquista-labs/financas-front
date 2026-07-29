import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetMetasModel } from "@/domain/usecases";

export type UseGetMetasOptions = Omit<
  UseQueryOptions<GetMetasModel, unknown, GetMetasModel>,
  "queryKey" | "queryFn"
>;
