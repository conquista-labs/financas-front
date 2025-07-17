import type {
  PatchPessoasIdRequest,
  PatchPessoasIdModel,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePatchPessoasIdOptions = Omit<
  UseMutationOptions<
    PatchPessoasIdModel,
    AxiosError,
    PatchPessoasIdRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
