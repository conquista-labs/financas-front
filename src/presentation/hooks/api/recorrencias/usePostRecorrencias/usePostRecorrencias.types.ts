import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PostRecorrenciasModel,
  PostRecorrenciasRequest,
} from "@/domain/usecases";

export type UsePostRecorrenciasOptions = Omit<
  UseMutationOptions<
    PostRecorrenciasModel,
    AxiosError,
    PostRecorrenciasRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
