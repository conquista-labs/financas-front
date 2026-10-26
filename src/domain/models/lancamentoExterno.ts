/**
 * Lançamento vindo da sincronização bancária (Pluggy), na caixa de entrada.
 * Espelha GET /caixa-entrada da financas-api (docs/sincronizacao-bancaria.md).
 */
export interface LancamentoExterno {
  id: string;
  /** YYYY-MM-DD — data do banco (no cartão, a da compra). */
  data: string;
  /**
   * Cartão de crédito com dia de vencimento: YYYY-MM-DD do vencimento da
   * fatura, a data em que a transação é lançada ao aceitar (mesma regra do
   * lançamento rápido). Null nos outros meios.
   */
  dataFatura: string | null;
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
  /** POSTED (confirmada) ou PENDING (cartão com a fatura ainda aberta). */
  statusBanco: "POSTED" | "PENDING";
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
  /** Já lançado/aceito: a transação a que ficou ligado (para conferir). */
  transacao: {
    descricao: string;
    /** YYYY-MM-DD — no cartão, o vencimento da fatura. */
    data: string;
    parcelaNumero: number | null;
    totalParcelas: number | null;
  } | null;
}
