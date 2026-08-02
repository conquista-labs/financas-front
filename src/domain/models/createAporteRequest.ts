/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
export interface CreateAporteRequest {
  valor: number;
  data: string;
  meioPagamentoId?: string;
  descricao?: string;
}
