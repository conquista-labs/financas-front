import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  PatchTransacoesIdModel,
  PatchTransacoesIdParams,
  PatchTransacoesIdRequest,
} from "@/domain/usecases";
import { makePatchTransacoesIdFactory } from "@/main/factories/usecases";

import type { UsePatchTransacoesIdOptions } from "./usePatchTransacoesId.types";

export const usePatchTransacoesId = (
  params: PatchTransacoesIdParams,
  options?: UsePatchTransacoesIdOptions,
): UseMutationResult<
  PatchTransacoesIdModel,
  AxiosError,
  PatchTransacoesIdRequest
> => {
  const patchTransacoesId = makePatchTransacoesIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patch-transacoes", params],
    mutationFn: (body: PatchTransacoesIdRequest) => {
      return patchTransacoesId.patch(body, params);
    },
    onSuccess: () => {
      // A navegação de volta (preservando os filtros) é feita pelo
      // TransactionForm via location.search; aqui só invalidamos o cache.
      queryClient.invalidateQueries({ queryKey: ["get-transacoes"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    ...options,
  });
};
