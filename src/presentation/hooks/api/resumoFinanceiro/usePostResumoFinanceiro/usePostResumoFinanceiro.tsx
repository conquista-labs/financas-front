import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  PostResumoFinanceiroModel,
  PostResumoFinanceiroParms,
} from "@/domain/usecases";
import { makePostResumoFinanceiroFactory } from "@/main/factories/usecases";

import type { UsePostResumoFinanceiroOptions } from "./usePostResumoFinanceiro.types";

export const usePostResumoFinanceiro = (
  options?: UsePostResumoFinanceiroOptions,
): UseMutationResult<
  PostResumoFinanceiroModel,
  AxiosError,
  PostResumoFinanceiroParms
> => {
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
      toast.error(error.message);
    },
    ...options,
  });
};
