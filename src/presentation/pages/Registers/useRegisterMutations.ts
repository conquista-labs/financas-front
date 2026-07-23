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

export type RegisterKind = "categoria" | "pessoa" | "meio";

export type CreateBody =
  | CreateCategoriaRequest
  | CreatePessoaRequest
  | CreateMeioPagamentoRequest;
export type EditBody =
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
 * CRUD dos cadastros (categoria/pessoa/meio) para o hub de Cadastros. Usa as
 * factories direto — os hooks `usePost*`/`usePatch*Id` do projeto carregam
 * efeitos RarUI (useToast) e navegam para rotas que este hub substituiu; aqui
 * só invalidamos a lista e deixamos a tela decidir o resto (toast sonner etc).
 */
export const useRegisterMutations = (kind: RegisterKind) => {
  const queryClient = useQueryClient();
  const { queryKey, post, patch, del } = config[kind];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [queryKey] });

  const create = useMutation({
    mutationFn: (body: CreateBody) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      post().post(body as any),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: EditBody }) =>
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
