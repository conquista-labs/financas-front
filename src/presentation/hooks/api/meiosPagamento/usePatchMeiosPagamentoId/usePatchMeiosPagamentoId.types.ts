import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PatchMeiosPagamentoIdModel,
  PatchMeiosPagamentoIdRequest,
} from "@/domain/usecases";

export type UsePatchMeiosPagamentoIdOptions = Omit<
  UseMutationOptions<
    PatchMeiosPagamentoIdModel,
    AxiosError,
    PatchMeiosPagamentoIdRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
