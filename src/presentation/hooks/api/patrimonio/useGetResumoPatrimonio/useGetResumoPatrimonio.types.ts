import type { UseQueryOptions } from "@tanstack/react-query";

import type { GetResumoPatrimonioModel } from "@/domain/usecases";

export type UseGetResumoPatrimonioOptions = Omit<
  UseQueryOptions<GetResumoPatrimonioModel, unknown, GetResumoPatrimonioModel>,
  "queryKey" | "queryFn"
>;
