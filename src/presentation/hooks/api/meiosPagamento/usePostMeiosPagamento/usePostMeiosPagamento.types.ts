import type {
  PostMeiosPagamentoRequest,
  PostMeiosPagamentoModel,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePostMeiosPagamentoOptions = Omit<
  UseMutationOptions<
    PostMeiosPagamentoModel,
    AxiosError,
    PostMeiosPagamentoRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
