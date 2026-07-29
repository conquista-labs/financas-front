/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { DesejoResponse } from "./desejoResponse";

/** Resposta padrão de create/edit/voto de desejo. */
export interface DesejoEnvelopeResponse {
  message: string;
  data: DesejoResponse;
}
