import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PostCategoriasModel,
  PostCategoriasRequest,
} from "@/domain/usecases";

export type UsePostCategoriasOptions = Omit<
  UseMutationOptions<
    PostCategoriasModel,
    AxiosError,
    PostCategoriasRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
