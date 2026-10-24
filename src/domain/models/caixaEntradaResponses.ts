import type { LancamentoExterno } from "./lancamentoExterno";
import type { PaginationMeta } from "./paginationMeta";

export interface GetCaixaEntradaResponse {
  message: string;
  data: { meta: PaginationMeta; rows: LancamentoExterno[] };
}

export interface CaixaEntradaResumo {
  pendentes: number;
  comDica: number;
  /** Pendentes com a dica "parece já lançada" (coincidência fraca). */
  possiveisDuplicadas: number;
  /** Vinculados sozinhos a uma transação já lançada (coincidência forte). */
  vinculadosAutomaticamente: number;
  aceitos: number;
  ignorados: number;
  ignoradosPorMotivo: { motivo: string; total: number }[];
}

export interface GetCaixaEntradaResumoResponse {
  message: string;
  data: CaixaEntradaResumo;
}

export interface AceitarLancamentosRequest {
  itens: {
    id: string;
    categoriaId?: string;
    descricao?: string;
    /** Omitido = titular da conta; "" = ninguém. */
    pessoaId?: string;
  }[];
}

export interface AceitarLancamentosResponse {
  message: string;
  data: {
    aceitos: number;
    vinculados: number;
    regrasAprendidas: number;
    erros: { id: string; erro: string }[];
  };
}

export interface IgnorarLancamentosRequest {
  ids: string[];
  /** Ignorar sempre lançamentos com a mesma descrição. */
  criarRegra?: boolean;
}

export interface IgnorarLancamentosResponse {
  message: string;
  data: { ignorados: number };
}

export interface RestaurarLancamentosRequest {
  ids: string[];
}

export interface RestaurarLancamentosResponse {
  message: string;
  data: { restaurados: number };
}

export interface IgnorarParecidasResponse {
  message: string;
  data: { ignorados: number };
}

export interface DesvincularLancamentosRequest {
  ids: string[];
}

export interface DesvincularLancamentosResponse {
  message: string;
  data: { desvinculados: number };
}

export interface ExecutarSincronizacaoResponse {
  message: string;
  data: {
    totais: {
      novos: number;
      ignorados: number;
      atualizados: number;
      vinculadosJaLancados: number;
      possiveisParesCasal: number;
      erros: number;
    };
    duracaoMs: number;
  };
}
