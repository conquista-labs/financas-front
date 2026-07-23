import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { PostPessoasModel, PostPessoasRequest } from "@/domain/usecases";

export type UsePostPessoasOptions = Omit<
  UseMutationOptions<PostPessoasModel, AxiosError, PostPessoasRequest, unknown>,
  "mutationKey" | "mutationFn"
>;
