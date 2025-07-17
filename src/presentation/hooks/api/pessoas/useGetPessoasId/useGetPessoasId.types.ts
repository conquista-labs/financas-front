import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetPessoasIdModel } from "@/domain/usecases";

export type UseGetPessoasIdOptions = Omit<
  UseQueryOptions<GetPessoasIdModel, unknown, GetPessoasIdModel>,
  "queryKey" | "queryFn"
>;
