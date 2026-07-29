/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { GetMetasResumoResponse } from "@/domain/models";

export interface GetMetasResumoUseCase {
  get: () => Promise<GetMetasResumoModel>;
}

export type GetMetasResumoModel = GetMetasResumoResponse;
