import { useToast } from "@rarui-react/components/dist/Toast";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import type {
  PostMeiosPagamentoModel,
  PostMeiosPagamentoRequest,
} from "@/domain/usecases";
import { makePostMeiosPagamentoFactory } from "@/main/factories/usecases";
import { urlRouters } from "@/presentation/router/router.definitions";

import type { UsePostMeiosPagamentoOptions } from "./usePostMeiosPagamento.types";

export const usePostMeiosPagamento = (
  options?: UsePostMeiosPagamentoOptions,
): UseMutationResult<
  PostMeiosPagamentoModel,
  AxiosError,
  PostMeiosPagamentoRequest
> => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const postMeiosPagamento = makePostMeiosPagamentoFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-meios-pagamentos"],
    mutationFn: (body: PostMeiosPagamentoRequest) =>
      postMeiosPagamento.post(body),
    onSuccess: () => {
      navigate(urlRouters.registers);
      queryClient.invalidateQueries({ queryKey: ["get-meios-pagamento"] });
    },
    onError: (error) => {
      addToast({
        title: error.message,
        appearance: "error",
        variant: "solid",
        duration: 4000,
      });
    },
    ...options,
  });
};
