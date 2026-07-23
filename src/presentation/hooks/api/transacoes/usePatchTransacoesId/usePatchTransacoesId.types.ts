import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PatchTransacoesIdModel,
  PatchTransacoesIdRequest,
} from "@/domain/usecases";

export type UsePatchTransacoesIdOptions = Omit<
  UseMutationOptions<
    PatchTransacoesIdModel,
    AxiosError,
    PatchTransacoesIdRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
