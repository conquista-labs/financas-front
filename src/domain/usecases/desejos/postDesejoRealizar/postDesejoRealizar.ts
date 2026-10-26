/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type {
  DesejoEnvelopeResponse,
  RealizarDesejoRequest,
} from "@/domain/models";

export interface PostDesejoRealizarUseCase {
  post: (
    params: PostDesejoRealizarParams,
    body: PostDesejoRealizarRequest,
  ) => Promise<PostDesejoRealizarModel>;
}

export type PostDesejoRealizarModel = DesejoEnvelopeResponse;
export type PostDesejoRealizarRequest = RealizarDesejoRequest;

export type PostDesejoRealizarParams = {
  id: string;
};
