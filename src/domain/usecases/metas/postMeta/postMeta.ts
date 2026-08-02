/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { CreateMetaRequest, MetaEnvelopeResponse } from "@/domain/models";

export interface PostMetaUseCase {
  post: (body: PostMetaRequest) => Promise<PostMetaModel>;
}

export type PostMetaModel = MetaEnvelopeResponse;
export type PostMetaRequest = CreateMetaRequest;
