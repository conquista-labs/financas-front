/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type {
  DesejoEnvelopeResponse,
  EditDesejoRequest,
} from "@/domain/models";

export interface PatchDesejoIdUseCase {
  patch: (
    params: PatchDesejoIdParams,
    body: PatchDesejoIdRequest,
  ) => Promise<PatchDesejoIdModel>;
}

export type PatchDesejoIdModel = DesejoEnvelopeResponse;
export type PatchDesejoIdRequest = EditDesejoRequest;

export type PatchDesejoIdParams = {
  id: string;
};
