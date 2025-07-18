import type {
  PostCategoriasRequest,
  PostCategoriasModel,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePostCategoriasOptions = Omit<
  UseMutationOptions<
    PostCategoriasModel,
    AxiosError,
    PostCategoriasRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
