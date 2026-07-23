import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PostMeiosPagamentoModel,
  PostMeiosPagamentoRequest,
} from "@/domain/usecases";

export type UsePostMeiosPagamentoOptions = Omit<
  UseMutationOptions<
    PostMeiosPagamentoModel,
    AxiosError,
    PostMeiosPagamentoRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
