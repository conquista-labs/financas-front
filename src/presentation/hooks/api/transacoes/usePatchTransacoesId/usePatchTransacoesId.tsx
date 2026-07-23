import { useToast } from "@rarui-react/components/dist/Toast";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import type {
  PatchTransacoesIdModel,
  PatchTransacoesIdParams,
  PatchTransacoesIdRequest,
} from "@/domain/usecases";
import { makePatchTransacoesIdFactory } from "@/main/factories/usecases";
import { urlRouters } from "@/presentation/router/router.definitions";

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
  const location = useLocation();
  const currentSearch = location.search;

  const patchTransacoesId = makePatchTransacoesIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patch-transacoes", params],
    mutationFn: (body: PatchTransacoesIdRequest) => {
      return patchTransacoesId.patch(body, params);
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
