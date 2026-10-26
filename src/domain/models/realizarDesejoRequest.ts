/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */

/** "Já realizei": o desejo foi conquistado sem virar meta. */
export interface RealizarDesejoRequest {
  /** YYYY-MM-DD — quando realizaram. Default: hoje. */
  realizadoEm?: string;
  /** Quanto custou no fim. */
  valorFinal?: number;
}
