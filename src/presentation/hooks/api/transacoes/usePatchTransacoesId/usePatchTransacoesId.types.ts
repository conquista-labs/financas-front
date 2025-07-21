import type {
  PatchTransacoesIdRequest,
  PatchTransacoesIdModel,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePatchTransacoesIdOptions = Omit<
  UseMutationOptions<
    PatchTransacoesIdModel,
    AxiosError,
    PatchTransacoesIdRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
