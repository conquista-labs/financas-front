/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { MetaEnvelopeResponse } from "@/domain/models";

export interface PostMetaReabrirUseCase {
  post: (params: PostMetaReabrirParams) => Promise<PostMetaReabrirModel>;
}

export type PostMetaReabrirModel = MetaEnvelopeResponse;

export type PostMetaReabrirParams = {
  id: string;
};
