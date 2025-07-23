import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { useToast } from "@rarui-react/components/dist/Toast";
import { urlRouters } from "@/presentation/router/router.definitions";
import { makeDeleteTransacoesIdFactory } from "@/main/factories/usecases";

import type {
  DeleteTransacoesIdParams,
  DeleteTransacoesIdModel,
} from "@/domain/usecases";
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
