import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  ConcluirMetaRequest,
  CreateDesejoRequest,
  CreateMetaRequest,
  EditDesejoRequest,
  EditMetaRequest,
  RealizarDesejoRequest,
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
  makePostDesejoReabrirFactory,
  makePostDesejoRealizarFactory,
  makePostMetaConcluirFactory,
  makePostMetaFactory,
  makePostMetaReabrirFactory,
  makePostMetaRestaurarFactory,
  makePutDesejoVotoFactory,
} from "@/main/factories/usecases";

/**
 * CRUD de Metas e Desejos. As mutations dessas entidades não têm hooks React
 * Query individuais (só as factories + os hooks GET existem), então este hook
 * consolida as operações das duas entidades relacionadas (inclui concluir/
 * reabrir meta e realizar/reabrir desejo — as "conquistas"), invalidando as
 * queries afetadas. A tela cuida de toast (sonner) e modais via
 * onSuccess/onError do `mutate`.
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

  // --- Conquistas (o resumo do ano soma metas e desejos: invalida os dois) ---
  const invalidateConquistas = () => {
    invalidateMetas();
    invalidateDesejos();
  };

  const concluirMeta = useMutation({
    mutationFn: ({ id, body }: { id: string; body: ConcluirMetaRequest }) =>
      makePostMetaConcluirFactory().post({ id }, body),
    onSuccess: invalidateConquistas,
  });

  const reabrirMeta = useMutation({
    mutationFn: (id: string) => makePostMetaReabrirFactory().post({ id }),
    onSuccess: invalidateConquistas,
  });

  const realizarDesejo = useMutation({
    mutationFn: ({ id, body }: { id: string; body: RealizarDesejoRequest }) =>
      makePostDesejoRealizarFactory().post({ id }, body),
    onSuccess: invalidateConquistas,
  });

  const reabrirDesejo = useMutation({
    mutationFn: (id: string) => makePostDesejoReabrirFactory().post({ id }),
    onSuccess: invalidateConquistas,
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
    createDesejo,
    updateDesejo,
    archiveDesejo,
    vote,
    unvote,
    promote,
    concluirMeta,
    reabrirMeta,
    realizarDesejo,
    reabrirDesejo,
  };
};
