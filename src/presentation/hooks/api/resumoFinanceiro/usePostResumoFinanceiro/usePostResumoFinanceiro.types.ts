import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PostResumoFinanceiroModel,
  PostResumoFinanceiroParms,
} from "@/domain/usecases";

export type UsePostResumoFinanceiroOptions = Omit<
  UseMutationOptions<
    PostResumoFinanceiroModel,
    AxiosError,
    PostResumoFinanceiroParms
  >,
  "mutationKey" | "mutationFn"
>;
