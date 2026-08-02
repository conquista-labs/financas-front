/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { DesejoEnvelopeResponse } from "@/domain/models";

export interface DeleteDesejoVotoUseCase {
  delete: (params: DeleteDesejoVotoParams) => Promise<DeleteDesejoVotoModel>;
}

export type DeleteDesejoVotoModel = DesejoEnvelopeResponse;

export type DeleteDesejoVotoParams = {
  id: string;
  pessoaId: string;
};
