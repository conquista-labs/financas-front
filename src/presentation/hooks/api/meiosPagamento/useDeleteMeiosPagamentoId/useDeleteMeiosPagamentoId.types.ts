import type {
  DeleteMeiosPagamentoIdModel,
  DeleteMeiosPagamentoIdParams,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UseDeleteMeiosPagamentoIdOptions = Omit<
  UseMutationOptions<
    DeleteMeiosPagamentoIdModel,
    AxiosError,
    DeleteMeiosPagamentoIdParams
  >,
  "mutationKey" | "mutationFn"
>;
