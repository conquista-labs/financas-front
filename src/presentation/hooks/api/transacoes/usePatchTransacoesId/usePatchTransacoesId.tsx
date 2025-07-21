import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useToast } from "@rarui-react/components/dist/Toast";

import { urlRouters } from "@/presentation/router/router.definitions";
import { makePatchTransacoesIdFactory } from "@/main/factories/usecases";
import type {
  PatchTransacoesIdParams,
  PatchTransacoesIdRequest,
  PatchTransacoesIdModel,
} from "@/domain/usecases";
import type { UsePatchTransacoesIdOptions } from "./usePatchTransacoesId.types";

export const usePatchTransacoesId = (
  params: PatchTransacoesIdParams,
  options?: UsePatchTransacoesIdOptions,
): UseMutationResult<
  PatchTransacoesIdModel,
  AxiosError,
  PatchTransacoesIdRequest
> => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const patchTransacoesId = makePatchTransacoesIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patch-transacoes", params],
    mutationFn: (body: PatchTransacoesIdRequest) => {
      return patchTransacoesId.patch(body, params);
    },
    onSuccess: () => {
      navigate(urlRouters.transactions);
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
