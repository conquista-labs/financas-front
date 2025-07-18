import type {
  PatchCategoriasIdRequest,
  PatchCategoriasIdModel,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePatchCategoriasIdOptions = Omit<
  UseMutationOptions<
    PatchCategoriasIdModel,
    AxiosError,
    PatchCategoriasIdRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
