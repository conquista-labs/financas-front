import type {
  DeleteCategoriasIdModel,
  DeleteCategoriasIdParams,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UseDeleteCategoriasIdOptions = Omit<
  UseMutationOptions<
    DeleteCategoriasIdModel,
    AxiosError,
    DeleteCategoriasIdParams
  >,
  "mutationKey" | "mutationFn"
>;
