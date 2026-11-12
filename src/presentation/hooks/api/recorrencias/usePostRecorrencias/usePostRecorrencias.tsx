import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  PostRecorrenciasModel,
  PostRecorrenciasRequest,
} from "@/domain/usecases";
import { makePostRecorrenciasFactory } from "@/main/factories/usecases";

import type { UsePostRecorrenciasOptions } from "./usePostRecorrencias.types";

/**
 * Cria uma recorrência (conta mensal). A API já materializa as transações
 * pendentes do horizonte, então invalida as listas de transações/calendário.
 */
export const usePostRecorrencias = (
  options?: UsePostRecorrenciasOptions,
): UseMutationResult<
  PostRecorrenciasModel,
  AxiosError,
  PostRecorrenciasRequest
> => {
  const postRecorrencias = makePostRecorrenciasFactory();
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationKey: ["post-recorrencias"],
    mutationFn: (body: PostRecorrenciasRequest) => postRecorrencias.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-recorrencias"] });
      queryClient.invalidateQueries({ queryKey: ["get-transacoes"] });
      queryClient.invalidateQueries({ queryKey: ["get-calendario"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
