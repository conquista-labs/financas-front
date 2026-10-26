/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */

/** "Concluir meta": conquistada na vida real, mesmo sem os aportes na tag. */
export interface ConcluirMetaRequest {
  /** YYYY-MM-DD — quando conseguiram. Default: hoje. */
  concluidaEm?: string;
  /** Quanto custou no fim. */
  valorFinal?: number;
  /** Compras (transações) que realizaram a meta — várias = parcelas. */
  compraTransacaoIds?: string[];
}
