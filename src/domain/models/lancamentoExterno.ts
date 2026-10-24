/**
 * Lançamento vindo da sincronização bancária (Pluggy), na caixa de entrada.
 * Espelha GET /caixa-entrada da financas-api (docs/sincronizacao-bancaria.md).
 */
export interface LancamentoExterno {
  id: string;
  /** YYYY-MM-DD */
  data: string;
  descricao: string;
  descricaoOriginal: string;
  /** Sempre positivo; o sentido vem de `tipo`. */
  valor: number;
  tipo: "receita" | "despesa";
  status: "pendente" | "aceito" | "vinculado" | "ignorado";
  /**
   * Pendente: dica para a revisão (possivel_casal | conta_recorrente |
   * possivel_duplicada). Ignorado: por quê (fatura | mesma_pessoa | casal |
   * investimento | regra | manual).
   */
  motivo: string | null;
  categoriaPluggy: string | null;
  parcelaNumero: number | null;
  totalParcelas: number | null;
  parLancamentoId: string | null;
  transacaoSugeridaId: string | null;
  categoriaSugerida: {
    id: string;
    nome: string;
    tipo: "receita" | "despesa";
  } | null;
  conta: { id: string; nome: string };
  /** Banco da conexão ("Nubank", "XP"…) — o cartão sozinho não diz. */
  banco: string | null;
  pessoa: { id: string; nome: string } | null;
  /** Meio sugerido: o da conta, ou pelo tipo de operação na conta corrente. */
  meioSugerido: { id: string; nome: string } | null;
}
