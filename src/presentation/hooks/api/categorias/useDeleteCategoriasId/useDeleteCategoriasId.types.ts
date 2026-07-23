import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  DeleteCategoriasIdModel,
  DeleteCategoriasIdParams,
} from "@/domain/usecases";

export type UseDeleteCategoriasIdOptions = Omit<
  UseMutationOptions<
    DeleteCategoriasIdModel,
    AxiosError,
    DeleteCategoriasIdParams
  >,
  "mutationKey" | "mutationFn"
>;
