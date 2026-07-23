import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PatchPessoasIdModel,
  PatchPessoasIdRequest,
} from "@/domain/usecases";

export type UsePatchPessoasIdOptions = Omit<
  UseMutationOptions<
    PatchPessoasIdModel,
    AxiosError,
    PatchPessoasIdRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
