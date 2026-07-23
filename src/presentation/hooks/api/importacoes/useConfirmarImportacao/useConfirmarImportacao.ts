import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { PostImportacoesConfirmarParams } from "@/domain/usecases";
import { makePostImportacoesConfirmarFactory } from "@/main/factories/usecases";

/**
 * Confirma as linhas revisadas, persistindo-as como transações. Ao concluir,
 * invalida as queries de transações/calendário/resumo para refletir o import.
 */
export const useConfirmarImportacao = () => {
  const confirmar = makePostImportacoesConfirmarFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-importacoes-confirmar"],
    mutationFn: (params: PostImportacoesConfirmarParams) =>
      confirmar.confirmar(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-transacoes"] });
      queryClient.invalidateQueries({ queryKey: ["get-calendario"] });
      queryClient.invalidateQueries({ queryKey: ["get-resumo-financeiro"] });
      queryClient.invalidateQueries({ queryKey: ["post-resumo-financeiro"] });
    },
  });
};
