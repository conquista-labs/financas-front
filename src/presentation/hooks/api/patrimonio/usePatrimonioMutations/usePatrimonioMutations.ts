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
 * CRUD de patrimônio para a tela-hub (lista + modal único).
 *
 * Os hooks `usePost*`/`usePatch*Id`/`useDelete*Id` de patrimônio são estáticos
 * por operação e o patch/delete recebem o id na montagem (servem às telas
 * dedicadas por rota); além disso invalidam só parte das queries. Este hub é
 * dinâmico (edita via modal, id só no submit) e precisa revalidar também a
 * evolução (gráfico). Por isso consolidamos as mutations aqui, invalidando
 * lista + resumo + evolução. A view decide toast/modal via onSuccess/onError.
 */
export const usePatrimonioMutations = () => {
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
