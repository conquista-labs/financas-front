import type { ExecutarSincronizacaoResponse } from "@/domain/models";

/** POST /sincronizacao/executar — puxa agora as transações dos bancos. */
export interface PostSincronizacaoExecutarUseCase {
  post: () => Promise<PostSincronizacaoExecutarModel>;
}

export type PostSincronizacaoExecutarModel = ExecutarSincronizacaoResponse;
