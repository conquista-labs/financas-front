/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type {
  CreateDesejoRequest,
  DesejoEnvelopeResponse,
} from "@/domain/models";

export interface PostDesejoUseCase {
  post: (body: PostDesejoRequest) => Promise<PostDesejoModel>;
}

export type PostDesejoModel = DesejoEnvelopeResponse;
export type PostDesejoRequest = CreateDesejoRequest;
