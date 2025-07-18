import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetCategoriasModel } from "@/domain/usecases";

export type UseGetCategoriasOptions = Omit<
  UseQueryOptions<GetCategoriasModel, unknown, GetCategoriasModel>,
  "queryKey" | "queryFn"
>;
