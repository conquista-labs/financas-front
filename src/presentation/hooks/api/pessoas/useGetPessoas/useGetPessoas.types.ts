import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetPessoasModel } from "@/domain/usecases";

export type UseGetPessoasOptions = Omit<
  UseQueryOptions<GetPessoasModel, unknown, GetPessoasModel>,
  "queryKey" | "queryFn"
>;
