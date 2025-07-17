import type { PostPessoasRequest, PostPessoasModel } from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePostPessoasOptions = Omit<
  UseMutationOptions<PostPessoasModel, AxiosError, PostPessoasRequest, unknown>,
  "mutationKey" | "mutationFn"
>;
