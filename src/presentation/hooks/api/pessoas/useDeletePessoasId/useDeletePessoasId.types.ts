import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  DeletePessoasIdModel,
  DeletePessoasIdParams,
} from "@/domain/usecases";

export type UseDeletePessoasIdOptions = Omit<
  UseMutationOptions<DeletePessoasIdModel, AxiosError, DeletePessoasIdParams>,
  "mutationKey" | "mutationFn"
>;
