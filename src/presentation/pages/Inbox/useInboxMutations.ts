import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  AceitarLancamentosRequest,
  IgnorarLancamentosRequest,
} from "@/domain/models";
import {
  makePostCaixaEntradaAceitarFactory,
  makePostCaixaEntradaDesvincularFactory,
  makePostCaixaEntradaIgnorarFactory,
  makePostCaixaEntradaIgnorarParecidasFactory,
  makePostCaixaEntradaRestaurarFactory,
  makePostSincronizacaoExecutarFactory,
} from "@/main/factories/usecases";

/**
 * Ações da caixa de entrada (mesmo padrão de useGoalsMutations: só as
 * factories existem, o hook consolida e invalida). Toasts ficam na tela.
 */
export const useInboxMutations = () => {
  const queryClient = useQueryClient();

  const invalidateCaixa = () => {
    queryClient.invalidateQueries({ queryKey: ["get-caixa-entrada"] });
    queryClient.invalidateQueries({ queryKey: ["get-caixa-entrada-resumo"] });
  };
  // Aceitar cria/paga transações: tudo que mostra transação precisa refazer.
  const invalidateTransacoes = () => {
    invalidateCaixa();
    for (const key of [
      "get-transacoes",
      "get-calendario",
      "get-resumo-financeiro",
      "post-resumo-financeiro",
    ]) {
      queryClient.invalidateQueries({ queryKey: [key] });
    }
  };

  const aceitar = useMutation({
    mutationFn: (body: AceitarLancamentosRequest) =>
      makePostCaixaEntradaAceitarFactory().post(body),
    onSuccess: invalidateTransacoes,
  });

  const ignorar = useMutation({
    mutationFn: (body: IgnorarLancamentosRequest) =>
      makePostCaixaEntradaIgnorarFactory().post(body),
    onSuccess: invalidateCaixa,
  });

  const restaurar = useMutation({
    mutationFn: (ids: string[]) =>
      makePostCaixaEntradaRestaurarFactory().post({ ids }),
    onSuccess: invalidateCaixa,
  });

  const ignorarParecidas = useMutation({
    mutationFn: () => makePostCaixaEntradaIgnorarParecidasFactory().post(),
    onSuccess: invalidateCaixa,
  });

  const desvincular = useMutation({
    mutationFn: (ids: string[]) =>
      makePostCaixaEntradaDesvincularFactory().post({ ids }),
    onSuccess: invalidateCaixa,
  });

  const sincronizar = useMutation({
    mutationFn: () => makePostSincronizacaoExecutarFactory().post(),
    onSuccess: invalidateCaixa,
  });

  return {
    aceitar,
    ignorar,
    ignorarParecidas,
    restaurar,
    desvincular,
    sincronizar,
  };
};
