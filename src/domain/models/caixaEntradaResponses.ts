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
  /** Ligados por vocês ("Já lancei"). */
  vinculadosManualmente: number;
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
    /** Omitido = o sugerido; "" = nenhum. */
    meioPagamentoId?: string;
    /** Compra parcelada: cria as parcelas restantes como pendentes. */
    criarFuturas?: boolean;
  }[];
}

export interface AceitarLancamentosResponse {
  message: string;
  data: {
    aceitos: number;
    vinculados: number;
    futurasCriadas?: number;
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

/** "Já lancei": transação que pode ser o lançamento do banco. */
export interface CandidataJaLancei {
  id: string;
  descricao: string;
  /** YYYY-MM-DD */
  data: string;
  valor: number;
  status: "pendente" | "paga";
  categoria: string | null;
  meioPagamento: string | null;
  pessoa: string | null;
  /** Dias até a data mais próxima do lançamento (compra ou fatura). */
  distanciaDias: number;
  /** Mesmo meio de pagamento da conta do lançamento. */
  mesmoMeio: boolean;
}

export interface GetCaixaEntradaCandidatasResponse {
  message: string;
  data: CandidataJaLancei[];
}

export interface VincularLancamentosRequest {
  /** Sem transacaoId, a API usa a melhor candidata. */
  itens: { id: string; transacaoId?: string }[];
}

export interface VincularLancamentosResponse {
  message: string;
  data: {
    vinculados: number;
    /** Transações que estavam pendentes e passaram a pagas. */
    marcadasPagas: number;
    erros: { id: string; erro: string }[];
  };
}

export interface ExcluirLancamentosRequest {
  ids: string[];
}

export interface ExcluirLancamentosResponse {
  message: string;
  data: { excluidos: number };
}
