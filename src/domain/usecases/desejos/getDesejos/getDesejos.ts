/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { GetDesejosResponse } from "@/domain/models";

export interface GetDesejosUseCase {
  get: (params: GetDesejosParams) => Promise<GetDesejosModel>;
}

export type GetDesejosModel = GetDesejosResponse;

export type GetDesejosParams = {
  arquivados?: boolean;
};
