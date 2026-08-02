/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { MetaEnvelopeResponse } from "@/domain/models";

export interface PostMetaRestaurarUseCase {
  post: (params: PostMetaRestaurarParams) => Promise<PostMetaRestaurarModel>;
}

export type PostMetaRestaurarModel = MetaEnvelopeResponse;

export type PostMetaRestaurarParams = {
  id: string;
};
