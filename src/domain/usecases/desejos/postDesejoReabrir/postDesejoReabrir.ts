/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { DesejoEnvelopeResponse } from "@/domain/models";

export interface PostDesejoReabrirUseCase {
  post: (params: PostDesejoReabrirParams) => Promise<PostDesejoReabrirModel>;
}

export type PostDesejoReabrirModel = DesejoEnvelopeResponse;

export type PostDesejoReabrirParams = {
  id: string;
};
