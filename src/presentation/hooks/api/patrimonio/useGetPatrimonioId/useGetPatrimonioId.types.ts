import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetPatrimonioIdModel } from "@/domain/usecases";

export type UseGetPatrimonioIdOptions = Omit<
  UseQueryOptions<GetPatrimonioIdModel, unknown, GetPatrimonioIdModel>,
  "queryKey" | "queryFn"
>;
