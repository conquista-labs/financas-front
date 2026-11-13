import {
  type QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  EditTransacaoRequest,
  GetTransacoesResponse,
  TransacaoResponse,
} from "@/domain/models";
import {
  makeDeleteTransacoesIdFactory,
  makePatchTransacoesIdFactory,
  makePostTransacoesIdPagarFactory,
} from "@/main/factories/usecases";

/** Tudo que mostra transação precisa recarregar depois de uma mudança. */
const CHAVES: string[][] = [
  ["get-transacoes"],
  ["get-calendario"],
  ["get-resumo-financeiro"],
  ["get", "analytics"],
];

type Snapshot = [readonly unknown[], GetTransacoesResponse | undefined][];

/**
 * Aplica a mudança nas listas em cache na hora (a API leva ~1s): a tela
 * responde ao clique e a recarga depois confirma. Devolve o estado anterior
 * para desfazer se a API falhar.
 */
export const aplicarNaLista = (
  queryClient: QueryClient,
  ids: string[],
  muda: (t: TransacaoResponse) => TransacaoResponse,
): Snapshot => {
  const alvo = new Set(ids);
  const antes = queryClient.getQueriesData<GetTransacoesResponse>({
    queryKey: ["get-transacoes"],
  });
  queryClient.setQueriesData<GetTransacoesResponse>(
    { queryKey: ["get-transacoes"] },
    (velho) =>
      velho?.data?.rows
        ? {
            ...velho,
            data: {
              ...velho.data,
              rows: velho.data.rows.map((t) =>
                alvo.has(t.id) ? muda(t as TransacaoResponse) : t,
              ),
            },
          }
        : velho,
  );
  return antes;
};

const desfazer = (queryClient: QueryClient, antes?: Snapshot) =>
  antes?.forEach(([key, data]) => queryClient.setQueryData(key, data));

/**
 * Ações da tela de Transações para UM ou VÁRIOS itens. A API não tem edição
 * em lote, então o lote é uma chamada por item (em paralelo).
 */
export const useTransacaoMutations = () => {
  const queryClient = useQueryClient();
  const recarregar = () =>
    CHAVES.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));

  /** PATCH parcial — só os campos enviados mudam. */
  const atualizar = useMutation({
    mutationFn: ({
      ids,
      body,
    }: {
      ids: string[];
      body: EditTransacaoRequest;
    }) =>
      Promise.all(
        ids.map((id) => makePatchTransacoesIdFactory().patch(body, { id })),
      ),
    onMutate: async ({ ids, body }) => {
      await queryClient.cancelQueries({ queryKey: ["get-transacoes"] });
      // Só campos simples; categoria/pessoa/meio mudam o objeto aninhado e
      // aparecem certinho na recarga logo em seguida.
      const { descricao, valor, data, observacoes, lembrarMe, tags, status } =
        body;
      const simples = Object.fromEntries(
        Object.entries({
          descricao,
          valor,
          observacoes,
          lembrarMe,
          tags,
          status,
        }).filter(([, v]) => v !== undefined),
      );
      return {
        antes: aplicarNaLista(queryClient, ids, (t) => ({
          ...t,
          ...simples,
          ...(data ? { data: data.slice(0, 10) } : {}),
          ...(status ? { statusExibicao: status } : {}),
        })),
      };
    },
    onError: (_e, _v, ctx) => desfazer(queryClient, ctx?.antes),
    onSettled: recarregar,
  });

  /** Marca como paga (registra pagaEm). */
  const pagar = useMutation({
    mutationFn: (id: string) =>
      makePostTransacoesIdPagarFactory().pagar({ id }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["get-transacoes"] });
      return {
        antes: aplicarNaLista(queryClient, [id], (t) => ({
          ...t,
          status: "paga",
          statusExibicao: "paga",
        })),
      };
    },
    onError: (_e, _v, ctx) => desfazer(queryClient, ctx?.antes),
    onSettled: recarregar,
  });

  /** Exclui só a transação (o escopo de parcelas fica no diálogo da tela). */
  const excluir = useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(
        ids.map((id) => makeDeleteTransacoesIdFactory().delete({ id })),
      ),
    onSuccess: recarregar,
  });

  return { atualizar, pagar, excluir };
};
