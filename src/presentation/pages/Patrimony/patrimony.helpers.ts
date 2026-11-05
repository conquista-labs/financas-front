import type { Patrimonio, SerieItem } from "@/domain/models";

const MESES_CURTOS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

/** "2023-11-01" (ISO) ou "01/11/2023" (BR) → "11/2023" (mês/ano da aquisição). */
export const mesAno = (value: string): string => {
  const br = /^\d{2}\/(\d{2})\/(\d{4})$/.exec(value);
  if (br) return `${br[1]}/${br[2]}`;
  const iso = /^(\d{4})-(\d{2})/.exec(value);
  if (iso) return `${iso[2]}/${iso[1]}`;
  return value;
};

/** "2025-07" (mesReferencia da série) → "jul/25" para o eixo do gráfico. */
export const labelMesRef = (mesReferencia: string): string => {
  const m = /^(\d{4})-(\d{2})/.exec(mesReferencia);
  if (!m) return mesReferencia;
  const mes = MESES_CURTOS[Number(m[2]) - 1] ?? "";
  return `${mes}/${m[1].slice(2)}`;
};

/** Delta valor atual - inicial (positivo = valorizou). Sem inicial → 0. */
export const delta = (p: Patrimonio): number =>
  p.valorAtual - (p.valorInicial ?? 0);

/**
 * Mostrar o "desde a compra"? Só quando diz algo: precisa do valor de compra,
 * de diferença, de valor hoje (zerado = vendido/resgatado, a "perda" seria
 * falsa) e não pode vir da corretora (aplicações e resgates mudam o total).
 */
export const mostraVariacao = (p: Patrimonio): boolean =>
  !!p.valorInicial && !p.pluggyItemId && p.valorAtual > 0 && delta(p) !== 0;

/** Quanto se deve num passivo: o saldo devedor (o mesmo que os totais usam). */
export const valorDivida = (p: Patrimonio): number =>
  p.saldoDevedor ?? p.valorAtual;

/**
 * Itens da lista, uma linha por coisa: o financiamento ligado a um bem não
 * aparece sozinho (vai na linha do bem). Bens primeiro (maior valor antes),
 * depois as dívidas soltas (maior dívida antes).
 */
export const linhasDaLista = (rows: Patrimonio[]): Patrimonio[] => {
  const ids = new Set(rows.map((r) => r.id));
  const ativos = rows
    .filter((r) => r.tipo === "ativo")
    .sort((a, b) => b.valorAtual - a.valorAtual);
  const passivosSoltos = rows
    .filter((r) => r.tipo === "passivo" && !(r.bemId && ids.has(r.bemId)))
    .sort((a, b) => valorDivida(b) - valorDivida(a));
  return [...ativos, ...passivosSoltos];
};

/** Abas da página. "resumo" é o consolidado; as outras são grupos. */
export type Aba = "resumo" | "imoveis" | "veiculos" | "reservas" | "dividas";
export type Grupo = Exclude<Aba, "resumo">;

export const GRUPOS: Grupo[] = ["imoveis", "veiculos", "reservas", "dividas"];

export const GRUPO_LABEL: Record<Grupo, string> = {
  imoveis: "Imóveis",
  veiculos: "Veículos",
  reservas: "Investimentos e reservas",
  dividas: "Dívidas",
};

/** Categoria sugerida ao criar um item a partir da aba. */
export const CATEGORIA_DA_ABA: Record<Aba, string> = {
  resumo: "",
  imoveis: "imovel",
  veiculos: "veiculo",
  reservas: "investimento",
  dividas: "divida",
};

/**
 * Em que grupo um item cai. Financiamento ligado a um bem vai com o bem (a
 * casa e a dívida dela ficam juntas); dívida solta tem grupo próprio.
 */
export const grupoDoItem = (
  p: Patrimonio,
  porId: Map<string, Patrimonio>,
): Grupo => {
  if (p.tipo === "passivo") {
    const bem = p.bemId ? porId.get(p.bemId) : undefined;
    return bem ? grupoDoItem(bem, porId) : "dividas";
  }
  if (p.categoria === "imovel") return "imoveis";
  if (p.categoria === "veiculo") return "veiculos";
  // Investimento, dinheiro parado e o resto (FGTS, previdência…).
  return "reservas";
};

export interface ResumoGrupo {
  grupo: Grupo;
  /** Linhas da lista do grupo (financiamento ligado vai na linha do bem). */
  linhas: Patrimonio[];
  /** Soma do que vale (ativos). */
  valor: number;
  /** Soma do que se deve (financiamentos dos bens e dívidas soltas). */
  divida: number;
  /** valor - divida: quanto do grupo é de vocês. */
  liquido: number;
}

/** Os itens separados por grupo, com os totais de cada um (grupos vazios saem). */
export const resumoPorGrupo = (rows: Patrimonio[]): ResumoGrupo[] => {
  const porId = new Map(rows.map((r) => [r.id, r]));
  const linhas = linhasDaLista(rows);
  return GRUPOS.map((grupo) => {
    const doGrupo = rows.filter((r) => grupoDoItem(r, porId) === grupo);
    const valor = doGrupo
      .filter((r) => r.tipo === "ativo")
      .reduce((s, r) => s + r.valorAtual, 0);
    const divida = doGrupo
      .filter((r) => r.tipo === "passivo")
      .reduce((s, r) => s + valorDivida(r), 0);
    return {
      grupo,
      linhas: linhas.filter((r) => grupoDoItem(r, porId) === grupo),
      valor,
      divida,
      liquido: valor - divida,
    };
  }).filter((g) => g.linhas.length > 0);
};

export interface EvolucaoPoint {
  mes: string;
  ativos: number;
  liquido: number;
  passivos: number;
}

/** Converte as séries da API no formato consumido pelo Recharts LineChart. */
export const toEvolucaoPoints = (series: SerieItem[]): EvolucaoPoint[] =>
  series.map((s) => ({
    mes: labelMesRef(s.mesReferencia),
    ativos: s.totalAtivos,
    liquido: s.patrimonioLiquido,
    passivos: s.totalPassivos,
  }));

/** Janela padrão do gráfico de evolução: últimos 12 meses até hoje. */
export const evolucaoRange = (hoje: Date) => {
  const fim = new Date(
    Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() + 1, 0),
  );
  const inicio = new Date(
    Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() - 11, 1),
  );
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return {
    dataInicio: iso(inicio),
    dataFim: iso(fim),
    granularidade: "mensal" as const,
  };
};
