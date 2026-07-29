import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateAporteRequest,
  CreateDesejoRequest,
  CreateMetaRequest,
  EditDesejoRequest,
  EditMetaRequest,
} from "@/domain/models";
import type { PostDesejoPromoverRequest } from "@/domain/usecases";
import {
  makeDeleteDesejoIdFactory,
  makeDeleteDesejoVotoFactory,
  makeDeleteMetaIdFactory,
  makePatchDesejoIdFactory,
  makePatchMetaIdFactory,
  makePostDesejoFactory,
  makePostDesejoPromoverFactory,
  makePostMetaAporteFactory,
  makePostMetaFactory,
  makePostMetaRestaurarFactory,
  makePutDesejoVotoFactory,
} from "@/main/factories/usecases";

/**
 * CRUD de Metas e Desejos via factories diretas (mesmo motivo do
 * `usePatrimonyMutations`: os hooks genéricos carregam efeitos RarUI). A tela
 * cuida de toast (sonner) e modais; aqui só invalidamos as queries.
 */
export const useGoalsMutations = () => {
  const queryClient = useQueryClient();

  const invalidateMetas = () => {
    queryClient.invalidateQueries({ queryKey: ["get-metas"] });
    queryClient.invalidateQueries({ queryKey: ["get-metas-resumo"] });
    queryClient.invalidateQueries({ queryKey: ["get-meta"] });
  };
  const invalidateDesejos = () =>
    queryClient.invalidateQueries({ queryKey: ["get-desejos"] });

  // --- Metas ---
  const createMeta = useMutation({
    mutationFn: (body: CreateMetaRequest) => makePostMetaFactory().post(body),
    onSuccess: () => {
      invalidateMetas();
      invalidateDesejos(); // pode arquivar um desejo (desejoId)
    },
  });

  const updateMeta = useMutation({
    mutationFn: ({ id, body }: { id: string; body: EditMetaRequest }) =>
      makePatchMetaIdFactory().patch({ id }, body),
    onSuccess: invalidateMetas,
  });

  const archiveMeta = useMutation({
    mutationFn: (id: string) => makeDeleteMetaIdFactory().delete({ id }),
    onSuccess: invalidateMetas,
  });

  const restoreMeta = useMutation({
    mutationFn: (id: string) => makePostMetaRestaurarFactory().post({ id }),
    onSuccess: invalidateMetas,
  });

  const addAporte = useMutation({
    mutationFn: ({ id, body }: { id: string; body: CreateAporteRequest }) =>
      makePostMetaAporteFactory().post({ id }, body),
    onSuccess: invalidateMetas,
  });

  // --- Desejos ---
  const createDesejo = useMutation({
    mutationFn: (body: CreateDesejoRequest) =>
      makePostDesejoFactory().post(body),
    onSuccess: invalidateDesejos,
  });

  const updateDesejo = useMutation({
    mutationFn: ({ id, body }: { id: string; body: EditDesejoRequest }) =>
      makePatchDesejoIdFactory().patch({ id }, body),
    onSuccess: invalidateDesejos,
  });

  const archiveDesejo = useMutation({
    mutationFn: (id: string) => makeDeleteDesejoIdFactory().delete({ id }),
    onSuccess: invalidateDesejos,
  });

  const vote = useMutation({
    mutationFn: ({ id, pessoaId }: { id: string; pessoaId: string }) =>
      makePutDesejoVotoFactory().put({ id, pessoaId }),
    onSuccess: invalidateDesejos,
  });

  const unvote = useMutation({
    mutationFn: ({ id, pessoaId }: { id: string; pessoaId: string }) =>
      makeDeleteDesejoVotoFactory().delete({ id, pessoaId }),
    onSuccess: invalidateDesejos,
  });

  const promote = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: PostDesejoPromoverRequest;
    }) => makePostDesejoPromoverFactory().post({ id }, body),
    onSuccess: () => {
      invalidateMetas();
      invalidateDesejos();
    },
  });

  return {
    createMeta,
    updateMeta,
    archiveMeta,
    restoreMeta,
    addAporte,
    createDesejo,
    updateDesejo,
    archiveDesejo,
    vote,
    unvote,
    promote,
  };
};
