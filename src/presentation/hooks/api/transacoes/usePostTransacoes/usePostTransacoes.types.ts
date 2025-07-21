import type {
  PostTransacoesRequest,
  PostTransacoesModel,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePostTransacoesOptions = Omit<
  UseMutationOptions<
    PostTransacoesModel,
    AxiosError,
    PostTransacoesRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
