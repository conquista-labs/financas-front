import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

import { parseAmount } from "@/lib/format";

/** O que a lista precisa de cada transação (subconjunto de TransacaoResponse). */
export interface LinhaTransacao {
  id: string;
  descricao: string;
  valor: number | string;
  data: string;
  statusExibicao?: string;
  parcelaNumero?: number | null;
  totalParcelas?: number | null;
  tags?: string[];
  categoria?: { nome?: string; tipo?: string; cor?: string | null } | null;
  meioPagamento?: { id?: string; nome?: string; tipo?: string } | null;
}

export const ehReceita = (t: LinhaTransacao) => t.categoria?.tipo === "receita";

/** Valor com sinal: receita soma, despesa subtrai. */
export const valorComSinal = (t: LinhaTransacao) =>
  (ehReceita(t) ? 1 : -1) * parseAmount(t.valor);

export interface GrupoDoDia<T extends LinhaTransacao> {
  /** "2026-11-09" */
  data: string;
  /** "Segunda, 09/11 · 2 lançamentos" ou "… · fatura Cartão Nubank · 46 lançamentos" */
  titulo: string;
  total: number;
  itens: T[];
}

const tituloDoDia = (iso: string) => {
  const d = parse(iso, "yyyy-MM-dd", new Date());
  const s = format(d, "EEEE, dd/MM", { locale: ptBR }).replace("-feira", "");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Agrupa por dia, na ordem em que vieram (a API já ordena por data desc).
 * Quando o dia inteiro é de um só cartão de crédito (2+ lançamentos), é a
 * fatura daquele cartão — vira parte do título, como no protótipo.
 */
export const agruparPorDia = <T extends LinhaTransacao>(
  linhas: T[],
): GrupoDoDia<T>[] => {
  const grupos: GrupoDoDia<T>[] = [];
  const porData = new Map<string, GrupoDoDia<T>>();
  for (const t of linhas) {
    const data = t.data.slice(0, 10);
    let g = porData.get(data);
    if (!g) {
      g = { data, titulo: "", total: 0, itens: [] };
      porData.set(data, g);
      grupos.push(g);
    }
    g.itens.push(t);
    g.total += valorComSinal(t);
  }
  for (const g of grupos) {
    const n = g.itens.length;
    const meios = new Set(g.itens.map((t) => t.meioPagamento?.id ?? ""));
    const meio = g.itens[0].meioPagamento;
    const fatura =
      n > 1 && meios.size === 1 && meio?.tipo === "credito" && meio.nome
        ? ` · fatura ${meio.nome}`
        : "";
    g.titulo = `${tituloDoDia(g.data)}${fatura} · ${n} ${n === 1 ? "lançamento" : "lançamentos"}`;
    g.total = Math.round(g.total * 100) / 100;
  }
  return grupos;
};

export type TomChip = "primary" | "warning" | "danger" | "neutral";

/** Marcas ao lado da descrição: parcela, tags e situação (a pagar/atrasada). */
export const chipsDaLinha = (t: LinhaTransacao) => {
  const chips: { texto: string; tom: TomChip }[] = [];
  if (t.parcelaNumero && t.totalParcelas && t.totalParcelas > 1)
    chips.push({
      texto: `${t.parcelaNumero}/${t.totalParcelas}`,
      tom: "primary",
    });
  for (const tag of t.tags ?? [])
    chips.push({ texto: `#${tag}`, tom: "neutral" });
  if (t.statusExibicao === "atrasada")
    chips.push({ texto: "atrasada", tom: "danger" });
  else if (t.statusExibicao === "pendente")
    chips.push({ texto: "a pagar", tom: "warning" });
  return chips;
};

/** Iniciais para o quadradinho colorido da linha (1ª letra da descrição). */
export const inicial = (descricao: string) =>
  (descricao.trim().match(/[\p{L}\p{N}]/u)?.[0] ?? "?").toUpperCase();
