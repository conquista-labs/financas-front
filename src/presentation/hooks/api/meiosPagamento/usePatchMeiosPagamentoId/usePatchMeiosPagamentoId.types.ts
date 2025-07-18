import type {
  PatchMeiosPagamentoIdRequest,
  PatchMeiosPagamentoIdModel,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePatchMeiosPagamentoIdOptions = Omit<
  UseMutationOptions<
    PatchMeiosPagamentoIdModel,
    AxiosError,
    PatchMeiosPagamentoIdRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
