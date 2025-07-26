import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@rarui-react/components/dist/Toast";

import { urlRouters } from "@/presentation/router/router.definitions";
import { makePostResumoFinanceiroFactory } from "@/main/factories/usecases";
import type { PostResumoFinanceiroModel } from "@/domain/usecases";
import type { UsePostResumoFinanceiroOptions } from "./usePostResumoFinanceiro.types";

export const usePostResumoFinanceiro = (
  options?: UsePostResumoFinanceiroOptions,
): UseMutationResult<
  PostResumoFinanceiroModel,
  AxiosError,
  PostResumoFinanceiroModel
> => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const postResumoFinanceiro = makePostResumoFinanceiroFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-ResumoFinanceiro"],
    mutationFn: () => postResumoFinanceiro.post(),
    onSuccess: () => {
      navigate(urlRouters.peoples);
      queryClient.invalidateQueries({ queryKey: ["get-ResumoFinanceiro"] });
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
