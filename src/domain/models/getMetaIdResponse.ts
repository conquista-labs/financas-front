/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { MetaDetalheResponse } from "./metaDetalheResponse";

export interface GetMetaIdResponse {
  message: string;
  data: MetaDetalheResponse;
}
