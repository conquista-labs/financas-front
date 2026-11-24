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
  meioPagamento?: { id: string; nome: string; tipo?: string } | null;
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

type ContaAgrupavel = {
  id: string;
  valor: number | string;
  data: string;
  meioPagamento?: { id: string; nome: string; tipo?: string } | null;
};

export type ItemDeContas<T> =
  | { tipo: "conta"; t: T }
  | {
      tipo: "fatura";
      /** meioPagamentoId|AAAA-MM-DD */
      chave: string;
      meio: string;
      data: string;
      itens: T[];
      total: number;
    };

/**
 * Junta as compras no cartão de crédito que vencem na mesma fatura (mesmo
 * cartão e mesma data) numa linha só — a fatura é o que se paga de verdade.
 * Uma compra sozinha na data continua como conta. Mantém a ordem por data.
 */
export const agruparPorFatura = <T extends ContaAgrupavel>(
  contas: T[],
): ItemDeContas<T>[] => {
  const faturas = new Map<string, T[]>();
  for (const t of contas)
    if (t.meioPagamento?.tipo === "credito") {
      const chave = `${t.meioPagamento.id}|${t.data.slice(0, 10)}`;
      faturas.set(chave, [...(faturas.get(chave) ?? []), t]);
    }
  const vistas = new Set<string>();
  const itens: ItemDeContas<T>[] = [];
  for (const t of contas) {
    const chave =
      t.meioPagamento?.tipo === "credito"
        ? `${t.meioPagamento.id}|${t.data.slice(0, 10)}`
        : null;
    const grupo = chave ? faturas.get(chave)! : null;
    if (!chave || !grupo || grupo.length < 2) {
      itens.push({ tipo: "conta", t });
      continue;
    }
    if (vistas.has(chave)) continue;
    vistas.add(chave);
    itens.push({
      tipo: "fatura",
      chave,
      meio: t.meioPagamento!.nome,
      data: t.data.slice(0, 10),
      itens: grupo,
      total:
        Math.round(grupo.reduce((s, x) => s + parseAmount(x.valor), 0) * 100) /
        100,
    });
  }
  const dataDe = (i: ItemDeContas<T>) =>
    i.tipo === "fatura" ? i.data : i.t.data;
  return itens.sort((a, b) => dataDe(a).localeCompare(dataDe(b)));
};

/** Quantas contas (transações) há nos itens — fatura conta as compras. */
export const contasNosItens = <T>(itens: ItemDeContas<T>[]) =>
  itens.reduce((n, i) => n + (i.tipo === "fatura" ? i.itens.length : 1), 0);
