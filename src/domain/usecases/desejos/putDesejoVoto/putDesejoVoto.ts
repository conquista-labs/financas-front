/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { DesejoEnvelopeResponse } from "@/domain/models";

export interface PutDesejoVotoUseCase {
  put: (params: PutDesejoVotoParams) => Promise<PutDesejoVotoModel>;
}

export type PutDesejoVotoModel = DesejoEnvelopeResponse;

export type PutDesejoVotoParams = {
  id: string;
  pessoaId: string;
};
