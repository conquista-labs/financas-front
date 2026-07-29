/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { EditMetaRequest, MetaEnvelopeResponse } from "@/domain/models";

export interface PatchMetaIdUseCase {
  patch: (
    params: PatchMetaIdParams,
    body: PatchMetaIdRequest,
  ) => Promise<PatchMetaIdModel>;
}

export type PatchMetaIdModel = MetaEnvelopeResponse;
export type PatchMetaIdRequest = EditMetaRequest;

export type PatchMetaIdParams = {
  id: string;
};
