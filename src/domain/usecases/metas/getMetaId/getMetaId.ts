/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { GetMetaIdResponse } from "@/domain/models";

export interface GetMetaIdUseCase {
  get: (params: GetMetaIdParams) => Promise<GetMetaIdModel>;
}

export type GetMetaIdModel = GetMetaIdResponse;

export type GetMetaIdParams = {
  id: string;
};
