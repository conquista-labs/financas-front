/**
 * Formatadores compartilhados da nova identidade "Nossa Grana".
 * Valores em pt-BR / BRL.
 *
 * IMPORTANTE: a API às vezes entrega valores JÁ formatados como string
 * (ex.: valor "R$ 99,90", resume.total "R$ 37.925,45") mesmo o model dizendo
 * number, e datas em formato BR ("15/07/2026"). Os helpers abaixo aceitam os
 * dois formatos para não gerar NaN.
 */

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

/**
 * Converte para número um valor que pode vir como number ou string BRL
 * ("R$ 1.234,56"). Retorna 0 se não for parseável.
 */
export const parseAmount = (
  value: number | string | null | undefined,
): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const normalized = value
    .replace(/\s| /g, "")
    .replace(/R\$/gi, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Formata como BRL. Aceita number ou string já formatada (nesse caso só
 * normaliza os espaços). 1234.56 → "R$ 1.234,56".
 */
export const formatCurrency = (
  value: number | string | null | undefined,
): string => {
  if (typeof value === "string" && /R\$/i.test(value)) {
    return value.replace(/ /g, " ").trim();
  }
  return BRL.format(parseAmount(value));
};

const MONTHS_SHORT = [
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

/**
 * Data → "08 jul" (dia + mês curto). Aceita ISO ("2026-07-08...") ou BR
 * ("08/07/2026").
 */
export const formatDayMonth = (value: string | null | undefined): string => {
  if (!value) return "";

  // Formato BR: dd/mm/yyyy
  const br = /^(\d{2})\/(\d{2})\/\d{4}$/.exec(value);
  if (br) {
    const day = br[1];
    const monthIndex = Number(br[2]) - 1;
    return `${day} ${MONTHS_SHORT[monthIndex] ?? ""}`;
  }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS_SHORT[d.getUTCMonth()]}`;
};

/**
 * Deriva número de parcelas para o badge "N/M". Aceita "parcela6x", "6x".
 * Retorna null quando à vista/1x/desconhecido.
 */
export const parseParcela = (
  formaPagamento?: string,
): { atual: number; total: number } | null => {
  if (!formaPagamento) return null;
  const match = /(\d+)x/.exec(formaPagamento);
  if (!match) return null;
  const total = Number(match[1]);
  return total > 1 ? { atual: 1, total } : null;
};

/**
 * Label da forma de pagamento. A API já costuma entregar pronto ("6x",
 * "à vista"); normaliza os casos "parcelaNx"/"avista" por segurança.
 */
export const formatFormaPagamento = (formaPagamento?: string): string => {
  if (!formaPagamento) return "à vista";
  if (formaPagamento === "avista") return "à vista";
  const match = /^parcela(\d+)x$/.exec(formaPagamento);
  return match ? `${match[1]}x` : formaPagamento;
};
