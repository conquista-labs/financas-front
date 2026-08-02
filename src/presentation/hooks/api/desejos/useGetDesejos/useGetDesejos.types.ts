import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetDesejosModel } from "@/domain/usecases";

export type UseGetDesejosOptions = Omit<
  UseQueryOptions<GetDesejosModel, unknown, GetDesejosModel>,
  "queryKey" | "queryFn"
>;
