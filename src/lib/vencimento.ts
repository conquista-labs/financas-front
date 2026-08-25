import { addMonths, format, parse, setDate } from "date-fns";

/**
 * Calcula a data de vencimento da fatura de um cartão de crédito para uma
 * compra: o `diaVencimento` no MÊS SEGUINTE à data da compra. Ex.: compra em
 * 25/08 com vencimento dia 8 → 08/09.
 *
 * Se o mês de destino não tiver o dia (ex.: dia 31 em fevereiro), usa o último
 * dia disponível daquele mês (clamp), evitando estouro para o mês seguinte.
 *
 * @param dataCompraISO data da compra em "yyyy-MM-dd"
 * @param diaVencimento dia 1..31
 * @returns vencimento em "yyyy-MM-dd" (ou a própria data se entradas inválidas)
 */
export const calcularVencimentoFatura = (
  dataCompraISO: string,
  diaVencimento: number,
): string => {
  const base = parse(dataCompraISO, "yyyy-MM-dd", new Date());
  if (isNaN(base.getTime()) || !diaVencimento) return dataCompraISO;

  const proximoMes = addMonths(base, 1);
  // Último dia do mês de destino, para "clampar" o dia (ex.: 31 → 28/29/30).
  const ultimoDia = new Date(
    proximoMes.getFullYear(),
    proximoMes.getMonth() + 1,
    0,
  ).getDate();
  const dia = Math.min(diaVencimento, ultimoDia);

  return format(setDate(proximoMes, dia), "yyyy-MM-dd");
};
