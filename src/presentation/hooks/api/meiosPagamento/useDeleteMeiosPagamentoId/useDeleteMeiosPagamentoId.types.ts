import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  DeleteMeiosPagamentoIdModel,
  DeleteMeiosPagamentoIdParams,
} from "@/domain/usecases";

export type UseDeleteMeiosPagamentoIdOptions = Omit<
  UseMutationOptions<
    DeleteMeiosPagamentoIdModel,
    AxiosError,
    DeleteMeiosPagamentoIdParams
  >,
  "mutationKey" | "mutationFn"
>;
