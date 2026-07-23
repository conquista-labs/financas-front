import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PatchCategoriasIdModel,
  PatchCategoriasIdRequest,
} from "@/domain/usecases";

export type UsePatchCategoriasIdOptions = Omit<
  UseMutationOptions<
    PatchCategoriasIdModel,
    AxiosError,
    PatchCategoriasIdRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
