/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { GetMetasResponse } from "@/domain/models";

export interface GetMetasUseCase {
  get: (params: GetMetasParams) => Promise<GetMetasModel>;
}

export type GetMetasModel = GetMetasResponse;

export type GetMetasParams = {
  status?: string;
  pessoaId?: string;
};
