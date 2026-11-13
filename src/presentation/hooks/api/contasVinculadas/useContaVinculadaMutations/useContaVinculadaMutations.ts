import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AtualizarContaVinculadaRequest } from "@/domain/models";
import { makePatchContasVinculadasIdFactory } from "@/main/factories/usecases";

/** Configurar uma conta vinculada (titular, meio, data de corte, ativa). */
export const useContaVinculadaMutations = () => {
  const queryClient = useQueryClient();
  const atualizar = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: AtualizarContaVinculadaRequest;
    }) => makePatchContasVinculadasIdFactory().patch(body, { id }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["get-contas-vinculadas"] }),
  });
  return { atualizar };
};
