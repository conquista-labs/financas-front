/**
 * Conta do Pluggy ligada ao nossa-grana (GET /contas-vinculadas).
 * Nasce inativa: só sincroniza depois de definir titular, meio e data de corte.
 */
export interface ContaVinculada {
  id: string;
  pluggyItemId: string;
  pluggyAccountId: string;
  nome: string;
  /** BANK | CREDIT (do Pluggy) */
  tipo: string;
  pessoaId: string | null;
  meioPagamentoId: string | null;
  /** ISO — lançamentos anteriores não entram. */
  sincronizarDesde: string;
  ativa: boolean;
  ultimaSincronizacao: string | null;
  ultimoErro: string | null;
  consentimentoExpiraEm: string | null;
  createdAt: string;
  pessoa: { id: string; nome: string } | null;
  meioPagamento: { id: string; nome: string } | null;
  /** O CPF do titular veio do banco (detecta Pix entre o casal). */
  titularIdentificado: boolean;
  /** Dia seguinte ao último lançamento do meio — boa data de corte. */
  sugestaoSincronizarDesde: string | null;
}

export interface GetContasVinculadasResponse {
  message: string;
  data: ContaVinculada[];
}

export interface AtualizarContaVinculadaRequest {
  nome?: string;
  /** "" para limpar */
  pessoaId?: string;
  /** "" para limpar */
  meioPagamentoId?: string;
  /** yyyy-MM-dd */
  sincronizarDesde?: string;
  ativa?: boolean;
}

export interface AtualizarContaVinculadaResponse {
  message: string;
  data: ContaVinculada;
}
