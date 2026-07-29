/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { MetaResponse } from "./metaResponse";
import type { MetaHistoricoPonto } from "./metaHistoricoPonto";

/** GET /metas/:id — item + histórico de 6 meses + média de aportes. */
export interface MetaDetalheResponse extends MetaResponse {
  /** Sempre 6 pontos (meses sem aporte vêm com valor 0). */
  historico: Array<MetaHistoricoPonto>;
  mediaAportes: number;
}
