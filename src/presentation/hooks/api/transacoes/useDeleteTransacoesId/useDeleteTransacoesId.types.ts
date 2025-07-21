import type {
  DeleteTransacoesIdModel,
  DeleteTransacoesIdParams,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UseDeleteTransacoesIdOptions = Omit<
  UseMutationOptions<
    DeleteTransacoesIdModel,
    AxiosError,
    DeleteTransacoesIdParams
  >,
  "mutationKey" | "mutationFn"
>;
