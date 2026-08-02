import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateCategoriaRequest,
  CreateMeioPagamentoRequest,
  CreatePessoaRequest,
  EditCategoriaRequest,
  EditMeioPagamentoRequest,
  EditPessoaRequest,
} from "@/domain/models";
import {
  makeDeleteCategoriasIdFactory,
  makeDeleteMeiosPagamentoIdFactory,
  makeDeletePessoasIdFactory,
  makePatchCategoriasIdFactory,
  makePatchMeiosPagamentoIdFactory,
  makePatchPessoasIdFactory,
  makePostCategoriasFactory,
  makePostMeiosPagamentoFactory,
  makePostPessoasFactory,
} from "@/main/factories/usecases";

export type CadastroKind = "categoria" | "pessoa" | "meio";

export type CreateCadastroBody =
  | CreateCategoriaRequest
  | CreatePessoaRequest
  | CreateMeioPagamentoRequest;
export type EditCadastroBody =
  | EditCategoriaRequest
  | EditPessoaRequest
  | EditMeioPagamentoRequest;

/** Factories + query key do GET, por entidade. */
const config = {
  categoria: {
    queryKey: "get-categorias",
    post: makePostCategoriasFactory,
    patch: makePatchCategoriasIdFactory,
    del: makeDeleteCategoriasIdFactory,
  },
  pessoa: {
    queryKey: "get-pessoas",
    post: makePostPessoasFactory,
    patch: makePatchPessoasIdFactory,
    del: makeDeletePessoasIdFactory,
  },
  meio: {
    queryKey: "get-meios-pagamento",
    post: makePostMeiosPagamentoFactory,
    patch: makePatchMeiosPagamentoIdFactory,
    del: makeDeleteMeiosPagamentoIdFactory,
  },
} as const;

/**
 * CRUD dinâmico dos cadastros (categoria/pessoa/meio) para o hub de Cadastros.
 *
 * Os hooks `usePost*`/`usePatch*Id`/`useDelete*Id` do projeto são estáticos por
 * entidade (e os de patch/delete recebem o id na montagem, servindo às telas
 * dedicadas por rota). A UI de Cadastros é dinâmica por aba (`kind`) com edição
 * via modal, onde o id só existe no submit — então este hook seleciona a
 * factory por `kind` e monta as mutations. Só invalida a lista; a view decide
 * navegação/toast via onSuccess/onError do `mutate`.
 */
export const useCadastroMutations = (kind: CadastroKind) => {
  const queryClient = useQueryClient();
  const { queryKey, post, patch, del } = config[kind];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [queryKey] });

  const create = useMutation({
    mutationFn: (body: CreateCadastroBody) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      post().post(body as any),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: EditCadastroBody }) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      patch().patch(body as any, { id }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => del().delete({ id }),
    onSuccess: invalidate,
  });

  const toggleFavorito = useMutation({
    mutationFn: ({ id, favorito }: { id: string; favorito: boolean }) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      patch().patch({ favorito } as any, { id }),
    onSuccess: invalidate,
  });

  return { create, update, remove, toggleFavorito };
};
