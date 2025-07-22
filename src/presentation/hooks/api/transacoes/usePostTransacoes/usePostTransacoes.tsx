import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@rarui-react/components/dist/Toast";

import { urlRouters } from "@/presentation/router/router.definitions";
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
  const navigate = useNavigate();
  const { addToast } = useToast();

  const location = useLocation();
  const currentSearch = location.search;
  const postTransacoes = makePostTransacoesFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-transacoes"],
    mutationFn: (body: PostTransacoesRequest) => postTransacoes.post(body),
    onSuccess: () => {
      navigate(`${urlRouters.transactions}${currentSearch}`);
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
    ...options,
  });
};
