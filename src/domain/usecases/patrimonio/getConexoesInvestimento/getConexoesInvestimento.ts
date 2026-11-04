/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { GetConexoesInvestimentoResponse } from "@/domain/models";

export interface GetConexoesInvestimentoUseCase {
  get: () => Promise<GetConexoesInvestimentoModel>;
}

export type GetConexoesInvestimentoModel = GetConexoesInvestimentoResponse;
