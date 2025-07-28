import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useToast } from "@rarui-react/components/dist/Toast";

import { makePostResumoFinanceiroFactory } from "@/main/factories/usecases";
import type {
  PostResumoFinanceiroModel,
  PostResumoFinanceiroParms,
} from "@/domain/usecases";
import type { UsePostResumoFinanceiroOptions } from "./usePostResumoFinanceiro.types";

export const usePostResumoFinanceiro = (
  options?: UsePostResumoFinanceiroOptions,
): UseMutationResult<
  PostResumoFinanceiroModel,
  AxiosError,
  PostResumoFinanceiroParms
> => {
  const { addToast } = useToast();
  const postResumoFinanceiro = makePostResumoFinanceiroFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-resumo-financeiro"],
    mutationFn: (params: PostResumoFinanceiroParms) =>
      postResumoFinanceiro.post(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-resumo-financeiro"],
      });
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
