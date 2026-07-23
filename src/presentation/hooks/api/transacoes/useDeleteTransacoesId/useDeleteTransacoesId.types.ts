import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  DeleteTransacoesIdModel,
  DeleteTransacoesIdParams,
} from "@/domain/usecases";

export type UseDeleteTransacoesIdOptions = Omit<
  UseMutationOptions<
    DeleteTransacoesIdModel,
    AxiosError,
    DeleteTransacoesIdParams
  >,
  "mutationKey" | "mutationFn"
>;
