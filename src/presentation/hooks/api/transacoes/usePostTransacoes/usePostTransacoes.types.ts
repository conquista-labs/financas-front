import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PostTransacoesModel,
  PostTransacoesRequest,
} from "@/domain/usecases";

export type UsePostTransacoesOptions = Omit<
  UseMutationOptions<
    PostTransacoesModel,
    AxiosError,
    PostTransacoesRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
