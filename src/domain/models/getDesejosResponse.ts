/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { DesejoResponse } from "./desejoResponse";

export interface GetDesejosResponse {
  message: string;
  data: Array<DesejoResponse>;
}
