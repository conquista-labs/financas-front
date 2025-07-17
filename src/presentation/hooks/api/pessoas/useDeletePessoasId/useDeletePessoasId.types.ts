import type {
  DeletePessoasIdModel,
  DeletePessoasIdParams,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UseDeletePessoasIdOptions = Omit<
  UseMutationOptions<DeletePessoasIdModel, AxiosError, DeletePessoasIdParams>,
  "mutationKey" | "mutationFn"
>;
