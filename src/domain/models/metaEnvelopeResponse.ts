/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { MetaResponse } from "./metaResponse";

/** Resposta padrão de create/edit/aporte/restaurar de meta (meta recalculada). */
export interface MetaEnvelopeResponse {
  message: string;
  data: MetaResponse;
}
