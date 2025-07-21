import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetEnumsModel } from "@/domain/usecases";

export type UseGetEnumsOptions = Omit<
  UseQueryOptions<GetEnumsModel, unknown, GetEnumsModel>,
  "queryKey" | "queryFn"
>;
