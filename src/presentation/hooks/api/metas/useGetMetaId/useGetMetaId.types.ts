import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetMetaIdModel } from "@/domain/usecases";

export type UseGetMetaIdOptions = Omit<
  UseQueryOptions<GetMetaIdModel, unknown, GetMetaIdModel>,
  "queryKey" | "queryFn"
>;
