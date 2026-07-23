import { useToast } from "@rarui-react/components/dist/Toast";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import type {
  DeleteTransacoesIdModel,
  DeleteTransacoesIdParams,
} from "@/domain/usecases";
import { makeDeleteTransacoesIdFactory } from "@/main/factories/usecases";
import { urlRouters } from "@/presentation/router/router.definitions";

import type { UseDeleteTransacoesIdOptions } from "./useDeleteTransacoesId.types";

export const useDeleteTransacoesId = (
  options?: UseDeleteTransacoesIdOptions,
): UseMutationResult<
  DeleteTransacoesIdModel,
  AxiosError,
  DeleteTransacoesIdParams
> => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentSearch = location.search;
  const { addToast } = useToast();
  const deleteTransacoesId = makeDeleteTransacoesIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-transacoes"],
    mutationFn: (params: DeleteTransacoesIdParams) => {
      return deleteTransacoesId.delete(params);
    },
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
