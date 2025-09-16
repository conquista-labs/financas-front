import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetCalendarioModel } from "@/domain/usecases";

export type UseGetCalendarioOptions = Omit<
  UseQueryOptions<GetCalendarioModel, unknown, GetCalendarioModel>,
  "queryKey" | "queryFn"
>;
