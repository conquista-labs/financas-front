import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  PostMeiosPagamentoModel,
  PostMeiosPagamentoRequest,
} from "@/domain/usecases";
import { makePostMeiosPagamentoFactory } from "@/main/factories/usecases";

import type { UsePostMeiosPagamentoOptions } from "./usePostMeiosPagamento.types";

export const usePostMeiosPagamento = (
  options?: UsePostMeiosPagamentoOptions,
): UseMutationResult<
  PostMeiosPagamentoModel,
  AxiosError,
  PostMeiosPagamentoRequest
> => {
  const postMeiosPagamento = makePostMeiosPagamentoFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-meios-pagamentos"],
    mutationFn: (body: PostMeiosPagamentoRequest) =>
      postMeiosPagamento.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-meios-pagamento"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    ...options,
  });
};
