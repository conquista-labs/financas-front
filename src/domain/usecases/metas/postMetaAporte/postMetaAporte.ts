/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type {
  CreateAporteRequest,
  MetaEnvelopeResponse,
} from "@/domain/models";

export interface PostMetaAporteUseCase {
  post: (
    params: PostMetaAporteParams,
    body: PostMetaAporteRequest,
  ) => Promise<PostMetaAporteModel>;
}

export type PostMetaAporteModel = MetaEnvelopeResponse;
export type PostMetaAporteRequest = CreateAporteRequest;

export type PostMetaAporteParams = {
  id: string;
};
