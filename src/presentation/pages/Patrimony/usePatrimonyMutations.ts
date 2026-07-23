import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreatePatrimonioRequest,
  EditPatrimonioRequest,
} from "@/domain/models";
import {
  makeDeletePatrimonioFactory,
  makePatchPatrimonioFactory,
  makePostPatrimonioFactory,
} from "@/main/factories/usecases";

/**
 * CRUD de patrimônio via factories diretas. Os hooks `usePostPatrimonio` etc.
 * do projeto carregam efeitos RarUI (useToast) e navegam para as rotas
 * Create/Edit que esta tela-hub substituiu; aqui só invalidamos as queries e
 * deixamos a tela cuidar de toast (sonner) e do modal.
 */
export const usePatrimonyMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["get-patrimonios"] });
    queryClient.invalidateQueries({ queryKey: ["get-resumo-patrimonio"] });
    queryClient.invalidateQueries({ queryKey: ["get-evolucao-patrimonio"] });
  };

  const create = useMutation({
    mutationFn: (body: CreatePatrimonioRequest) =>
      makePostPatrimonioFactory().post(body),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: EditPatrimonioRequest }) =>
      makePatchPatrimonioFactory().patch({ id }, body),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => makeDeletePatrimonioFactory().delete({ id }),
    onSuccess: invalidate,
  });

  return { create, update, remove };
};
