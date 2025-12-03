import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetPatrimoniosModel } from "@/domain/usecases";

export type UseGetPatrimoniosOptions = Omit<
  UseQueryOptions<GetPatrimoniosModel, unknown, GetPatrimoniosModel>,
  "queryKey" | "queryFn"
>;
