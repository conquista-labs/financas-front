import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  makeDeleteTagsFactory,
  makePatchTagsFactory,
} from "@/main/factories/usecases";

/**
 * Renomear/excluir tags via factories diretas. Renomear e excluir PROPAGAM às
 * transações, então invalidamos também as queries de transações/calendário.
 */
export const useTagMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["get-tags"] });
    queryClient.invalidateQueries({ queryKey: ["get-transacoes"] });
    queryClient.invalidateQueries({ queryKey: ["get-calendario"] });
  };

  const rename = useMutation({
    mutationFn: ({ id, nome }: { id: string; nome: string }) =>
      makePatchTagsFactory().patch({ nome }, { id }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => makeDeleteTagsFactory().delete({ id }),
    onSuccess: invalidate,
  });

  return { rename, remove };
};
