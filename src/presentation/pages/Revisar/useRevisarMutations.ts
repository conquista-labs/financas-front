import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  AceitarLancamentosRequest,
  CaixaEntradaResumo,
  GetCaixaEntradaResponse,
  IgnorarLancamentosRequest,
  LancamentoExterno,
  VincularLancamentosRequest,
} from "@/domain/models";
import {
  makePostCaixaEntradaAceitarFactory,
  makePostCaixaEntradaDesvincularFactory,
  makePostCaixaEntradaExcluirFactory,
  makePostCaixaEntradaIgnorarFactory,
  makePostCaixaEntradaIgnorarParecidasFactory,
  makePostCaixaEntradaLimparIgnoradosFactory,
  makePostCaixaEntradaRestaurarFactory,
  makePostCaixaEntradaVincularFactory,
  makePostSincronizacaoExecutarFactory,
} from "@/main/factories/usecases";

import { type Destino, moverNoResumo, tirarDaLista } from "./revisar.cache";

/**
 * Ações da caixa de entrada (mesmo padrão de useGoalsMutations: só as
 * factories existem, o hook consolida e invalida). Toasts ficam na tela.
 *
 * Ações num item (aceitar, ignorar, já lancei, excluir, restaurar,
 * desvincular) não invalidam a caixa sozinhas: a tela chama `tirarDaFila`
 * com os que deram certo, no mesmo momento em que pula para o próximo — a
 * lista e os contadores mudam juntos. Ações em lote (sincronizar, ignorar
 * parecidas, limpar) só terminam depois que a lista nova chegou.
 */
export const useRevisarMutations = () => {
  const queryClient = useQueryClient();

  const invalidateCaixa = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["get-caixa-entrada"] }),
      queryClient.invalidateQueries({
        queryKey: ["get-caixa-entrada-resumo"],
      }),
    ]);

  /** Tira da lista e acerta os contadores já; o servidor confirma depois. */
  const tirarDaFila = (itens: LancamentoExterno[], para: Destino) => {
    if (!itens.length) return;
    const ids = new Set(itens.map((l) => l.id));
    queryClient.setQueriesData<GetCaixaEntradaResponse>(
      { queryKey: ["get-caixa-entrada"] },
      (old) => tirarDaLista(old, ids),
    );
    queryClient.setQueryData<{ message: string; data: CaixaEntradaResumo }>(
      ["get-caixa-entrada-resumo"],
      (old) => old && { ...old, data: moverNoResumo(old.data, itens, para) },
    );
    void invalidateCaixa();
  };

  // Aceitar cria/paga transações: tudo que mostra transação precisa refazer.
  const invalidateTransacoes = () => {
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
  });

  const restaurar = useMutation({
    mutationFn: (ids: string[]) =>
      makePostCaixaEntradaRestaurarFactory().post({ ids }),
  });

  const ignorarParecidas = useMutation({
    mutationFn: () => makePostCaixaEntradaIgnorarParecidasFactory().post(),
    onSuccess: invalidateCaixa,
  });

  const desvincular = useMutation({
    mutationFn: (ids: string[]) =>
      makePostCaixaEntradaDesvincularFactory().post({ ids }),
  });

  // "Já lancei" pode marcar uma transação pendente como paga.
  const vincular = useMutation({
    mutationFn: (body: VincularLancamentosRequest) =>
      makePostCaixaEntradaVincularFactory().post(body),
    onSuccess: invalidateTransacoes,
  });

  const excluir = useMutation({
    mutationFn: (ids: string[]) =>
      makePostCaixaEntradaExcluirFactory().post({ ids }),
  });

  const limparIgnorados = useMutation({
    mutationFn: () => makePostCaixaEntradaLimparIgnoradosFactory().post(),
    onSuccess: invalidateCaixa,
  });

  const sincronizar = useMutation({
    mutationFn: () => makePostSincronizacaoExecutarFactory().post(),
    onSuccess: invalidateCaixa,
  });

  return {
    tirarDaFila,
    aceitar,
    ignorar,
    ignorarParecidas,
    restaurar,
    desvincular,
    vincular,
    excluir,
    limparIgnorados,
    sincronizar,
  };
};
