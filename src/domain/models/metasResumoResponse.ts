/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { MetaResponse } from "./metaResponse";

/** GET /metas/resumo — cards do topo. */
export interface MetasResumoResponse {
  totalGuardado: number;
  totalAlvo: number;
  percentual: number;
  aportadoNoMes: number;
  aportePlanejado: number;
  metasNoRitmo: number;
  metasTotal: number;
  /** As 2 metas mais adiantadas (mesmo formato do item). */
  destaques: Array<MetaResponse>;
}
