/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */

/** Conexão Pluggy com investimentos (GET /sincronizacao/investimentos). */
export interface ConexaoInvestimento {
  pluggyItemId: string;
  /** "XP", "Nubank"… (null se não deu para saber). */
  banco: string | null;
  titular: string | null;
  posicoesAtivas: number;
  total: number;
  /** Patrimônio que essa conexão já alimenta. */
  patrimonio: { id: string; descricao: string } | null;
}

export interface GetConexoesInvestimentoResponse {
  message: string;
  data: ConexaoInvestimento[];
}

export interface VincularInvestimentosRequest {
  /** null = desliga (o valor volta a ser lançado à mão). */
  pluggyItemId: string | null;
}

export interface VincularInvestimentosResponse {
  message: string;
  data: {
    patrimonioId: string;
    pluggyItemId: string | null;
    total?: number;
    posicoesAtivas?: number;
    sincronizadoEm?: string;
  };
}
