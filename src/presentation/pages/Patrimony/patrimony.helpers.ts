import type { Patrimonio, SerieItem } from "@/domain/models";

/** Roxo primário como fallback de cor de categoria. */
const FALLBACK_COLOR = "#5B4BE0";

/**
 * Cor por categoria de patrimônio (usada nas barras de composição e realces).
 * Chaves = `categoria` crua do backend (não a formatada).
 */
const CATEGORIA_COLOR: Record<string, string> = {
  imovel: "#6C5CE7",
  investimento: "#12A66A",
  veiculo: "#2D9CDB",
  disponivel: "#0EA5E9",
  outros_ativos: "#E58E26",
  financiamento: "#E5484D",
  emprestimo: "#F0883E",
  divida: "#D6409F",
  outros_passivos: "#8B8B94",
};

export const categoriaColor = (categoria: string): string =>
  CATEGORIA_COLOR[categoria] ?? FALLBACK_COLOR;

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
