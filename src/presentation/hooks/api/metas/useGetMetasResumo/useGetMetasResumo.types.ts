import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetMetasResumoModel } from "@/domain/usecases";

export type UseGetMetasResumoOptions = Omit<
  UseQueryOptions<GetMetasResumoModel, unknown, GetMetasResumoModel>,
  "queryKey" | "queryFn"
>;
