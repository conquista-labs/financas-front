/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
export interface EditMetaRequest {
  titulo?: string;
  valorAlvo?: number;
  valorInicial?: number;
  aporteMensal?: number;
  dataAlvo?: string;
  tag?: string;
  pessoaId?: string | null;
  patrimonioId?: string | null;
}
