import type { DiaCalendario, TransacaoCalendario } from "@/domain/models";
import { parseAmount } from "@/lib/format";

/** Transação como vem de GET /transacoes (só o que a Agenda usa). */
export interface TransacaoDoMes {
  id: string;
  descricao: string;
  valor: number | string;
  data: string;
  status?: string;
  statusExibicao?: string;
  pagaEm?: string | null;
  formaPagamento?: string | null;
  lembrarMe?: boolean;
  tags?: string[];
  categoria?: { id: string; nome: string; cor?: string; tipo?: string } | null;
  pessoa?: { id: string; nome: string } | null;
  meioPagamento?: { id: string; nome: string } | null;
}

const diaDe = (data: string) => Number(data.slice(8, 10));

/**
 * Monta os dias do mês (no formato do calendário) a partir de TODAS as
 * transações do período. O endpoint /transacoes/calendario só traz as com
 * "lembrar-me", então não serve para os totais do mês.
 */
export const diasDoMes = (
  transacoes: TransacaoDoMes[],
  ano: number,
  mes: number, // 1-12
): DiaCalendario[] => {
  const n = new Date(ano, mes, 0).getDate();
  const dias: DiaCalendario[] = Array.from({ length: n }, (_, i) => ({
    dia: i + 1,
    data: `${ano}-${String(mes).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
    transacoes: [],
    totalDespesas: 0,
    totalReceitas: 0,
    quantidadeTransacoes: 0,
  }));
  for (const t of transacoes) {
    const d = dias[diaDe(t.data) - 1];
    if (!d) continue;
    const tipo: TransacaoCalendario.TipoEnum =
      t.categoria?.tipo === "receita" ? "receita" : "despesa";
    const valor = parseAmount(t.valor);
    d.transacoes.push({
      id: t.id,
      descricao: t.descricao,
      valor,
      categoria: t.categoria
        ? {
            id: t.categoria.id,
            nome: t.categoria.nome,
            cor: t.categoria.cor,
            tipo,
          }
        : null,
      pessoa: t.pessoa ? { id: t.pessoa.id, nome: t.pessoa.nome } : null,
      meioPagamento: t.meioPagamento
        ? { id: t.meioPagamento.id, nome: t.meioPagamento.nome }
        : null,
      formaPagamento: t.formaPagamento ?? null,
      lembrarMe: !!t.lembrarMe,
      tags: t.tags ?? [],
      tipo,
    } as TransacaoCalendario);
    if (tipo === "receita") d.totalReceitas += valor;
    else d.totalDespesas += valor;
    d.quantidadeTransacoes += 1;
  }
  return dias;
};

/** Dias do mês com conta ainda não paga (a bolinha na grade). */
export const diasComConta = (transacoes: TransacaoDoMes[]) =>
  new Set(
    transacoes.filter((t) => t.status === "pendente").map((t) => diaDe(t.data)),
  );

/** Quanto ainda falta pagar no mês (pendentes, vencidas ou não). */
export const aPagarNoMes = (transacoes: TransacaoDoMes[]) =>
  transacoes
    .filter((t) => t.status === "pendente" && t.categoria?.tipo !== "receita")
    .reduce((s, t) => s + parseAmount(t.valor), 0);

/** Contas pagas no mês: as que estavam pendentes e foram marcadas (pagaEm). */
export const contasPagas = (transacoes: TransacaoDoMes[]) =>
  transacoes
    .filter((t) => t.status === "paga" && !!t.pagaEm)
    .sort((a, b) => a.data.localeCompare(b.data));

/** Valor curto para a célula do dia: -120, +2,6k, -6,9k, +12k. */
export const valorCurto = (n: number) => {
  const sinal = n >= 0 ? "+" : "-";
  const a = Math.abs(n);
  if (a < 1000) return `${sinal}${Math.round(a)}`;
  const k = a / 1000;
  const txt =
    k < 10
      ? k.toFixed(1).replace(".", ",").replace(",0", "")
      : String(Math.round(k));
  return `${sinal}${txt}k`;
};
