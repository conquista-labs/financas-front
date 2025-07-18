import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetCategoriasIdModel } from "@/domain/usecases";

export type UseGetCategoriasIdOptions = Omit<
  UseQueryOptions<GetCategoriasIdModel, unknown, GetCategoriasIdModel>,
  "queryKey" | "queryFn"
>;
