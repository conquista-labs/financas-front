/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { CreateMetaRequest, MetaEnvelopeResponse } from "@/domain/models";

export interface PostDesejoPromoverUseCase {
  post: (
    params: PostDesejoPromoverParams,
    body: PostDesejoPromoverRequest,
  ) => Promise<PostDesejoPromoverModel>;
}

/** Cria a meta e arquiva o desejo — devolve a meta. */
export type PostDesejoPromoverModel = MetaEnvelopeResponse;
/** Mesmo body do POST /metas, sem desejoId (o próprio desejo é a origem). */
export type PostDesejoPromoverRequest = Omit<CreateMetaRequest, "desejoId">;

export type PostDesejoPromoverParams = {
  id: string;
};
