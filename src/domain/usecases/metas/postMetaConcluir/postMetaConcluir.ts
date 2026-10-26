/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type {
  ConcluirMetaRequest,
  MetaEnvelopeResponse,
} from "@/domain/models";

export interface PostMetaConcluirUseCase {
  post: (
    params: PostMetaConcluirParams,
    body: PostMetaConcluirRequest,
  ) => Promise<PostMetaConcluirModel>;
}

export type PostMetaConcluirModel = MetaEnvelopeResponse;
export type PostMetaConcluirRequest = ConcluirMetaRequest;

export type PostMetaConcluirParams = {
  id: string;
};
