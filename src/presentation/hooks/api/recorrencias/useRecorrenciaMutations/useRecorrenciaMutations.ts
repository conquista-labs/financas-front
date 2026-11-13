import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { EditRecorrenciaRequest } from "@/domain/models";
import {
  makeDeleteRecorrenciasIdFactory,
  makePatchRecorrenciasIdFactory,
} from "@/main/factories/usecases";

/**
 * Editar/pausar/excluir recorrências. A API propaga para as ocorrências
 * futuras pendentes, então transações e calendário também recarregam.
 */
export const useRecorrenciaMutations = () => {
  const queryClient = useQueryClient();
  const recarregar = () => {
    for (const key of ["get-recorrencias", "get-transacoes", "get-calendario"])
      queryClient.invalidateQueries({ queryKey: [key] });
  };

  const atualizar = useMutation({
    mutationFn: ({ id, body }: { id: string; body: EditRecorrenciaRequest }) =>
      makePatchRecorrenciasIdFactory().patch(body, { id }),
    onSuccess: recarregar,
  });

  const excluir = useMutation({
    mutationFn: (id: string) =>
      makeDeleteRecorrenciasIdFactory().delete({ id }),
    onSuccess: recarregar,
  });

  return { atualizar, excluir };
};
