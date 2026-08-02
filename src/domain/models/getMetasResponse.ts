/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { MetaResponse } from "./metaResponse";

export interface GetMetasResponse {
  message: string;
  data: Array<MetaResponse>;
}
