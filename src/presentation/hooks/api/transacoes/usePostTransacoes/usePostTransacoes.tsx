import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useToast } from "@rarui-react/components/dist/Toast";

import { makePostTransacoesFactory } from "@/main/factories/usecases";
import type {
  PostTransacoesRequest,
  PostTransacoesModel,
} from "@/domain/usecases";
import type { UsePostTransacoesOptions } from "./usePostTransacoes.types";

export const usePostTransacoes = (
  options?: UsePostTransacoesOptions,
): UseMutationResult<
  PostTransacoesModel,
  AxiosError,
  PostTransacoesRequest
> => {
  const { addToast } = useToast();

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
      addToast({
        title: error.message,
        appearance: "error",
        variant: "solid",
        duration: 4000,
      });
    },
  });
};
