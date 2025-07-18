import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@rarui-react/components/dist/Toast";

import { urlRouters } from "@/presentation/router/router.definitions";
import { makePostMeiosPagamentoFactory } from "@/main/factories/usecases";
import type {
  PostMeiosPagamentoRequest,
  PostMeiosPagamentoModel,
} from "@/domain/usecases";
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
      navigate(urlRouters.meansOfPayment);
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
