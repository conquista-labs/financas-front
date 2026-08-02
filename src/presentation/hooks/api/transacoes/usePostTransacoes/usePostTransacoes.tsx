import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  PostTransacoesModel,
  PostTransacoesRequest,
} from "@/domain/usecases";
import { makePostTransacoesFactory } from "@/main/factories/usecases";

import type { UsePostTransacoesOptions } from "./usePostTransacoes.types";

export const usePostTransacoes = (
  options?: UsePostTransacoesOptions,
): UseMutationResult<
  PostTransacoesModel,
  AxiosError,
  PostTransacoesRequest
> => {
  const postTransacoes = makePostTransacoesFactory();
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationKey: ["post-transacoes"],
    mutationFn: (body: PostTransacoesRequest) => postTransacoes.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-transacoes"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
