import type { DiaCalendario, TransacaoCalendario } from "@/domain/models";

export const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Net do dia = receitas − despesas (ambos vêm prontos da API). */
export const netDoDia = (dia: DiaCalendario): number =>
  (dia.totalReceitas ?? 0) - (dia.totalDespesas ?? 0);

export interface GridCell {
  empty: boolean;
  dia?: DiaCalendario;
}

/**
 * Monta a grade do calendário: células vazias antes do dia 1 (offset da semana)
 * + todos os dias do mês. A API já retorna os 31 dias; `firstDow` = dia da
 * semana (0=Dom) do dia 1.
 */
export const buildGrid = (
  dias: DiaCalendario[],
  ano: number,
  mes: number, // 1-12
): GridCell[] => {
  const firstDow = new Date(ano, mes - 1, 1).getDay();
  const cells: GridCell[] = [];
  for (let i = 0; i < firstDow; i++) cells.push({ empty: true });
  dias.forEach((dia) => cells.push({ empty: false, dia }));
  while (cells.length % 7 !== 0) cells.push({ empty: true });
  return cells;
};

/**
 * Opacidade do heatmap de gasto (vermelho) proporcional ao maior gasto do mês.
 * Retorna null quando não há despesa (célula sem heatmap).
 */
export const heatOpacity = (gasto: number, maxGasto: number): number | null => {
  if (gasto <= 0 || maxGasto <= 0) return null;
  const intensidade = gasto / maxGasto;
  return 0.06 + intensidade * 0.28;
};

export interface CalendarKpiData {
  receitas: number;
  despesas: number;
  saldo: number;
  maiorGasto: number;
  maiorGastoDia: number | null;
}

/** Agrega os KPIs do mês a partir dos dias. */
export const buildKpis = (dias: DiaCalendario[]): CalendarKpiData => {
  let receitas = 0;
  let despesas = 0;
  let maiorGasto = 0;
  let maiorGastoDia: number | null = null;
  dias.forEach((dia) => {
    receitas += dia.totalReceitas ?? 0;
    despesas += dia.totalDespesas ?? 0;
    if ((dia.totalDespesas ?? 0) > maiorGasto) {
      maiorGasto = dia.totalDespesas ?? 0;
      maiorGastoDia = dia.dia;
    }
  });
  return {
    receitas,
    despesas,
    saldo: receitas - despesas,
    maiorGasto,
    maiorGastoDia,
  };
};

export interface WeekSummary {
  label: string;
  despesa: number;
  net: number;
  pct: number; // largura da barra (% do maior gasto semanal)
}

/** Resumo por semana (agrupa a cada 7 dias da grade). */
export const buildWeekSummaries = (cells: GridCell[]): WeekSummary[] => {
  const weeks: WeekSummary[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const slice = cells.slice(i, i + 7);
    let despesa = 0;
    let net = 0;
    slice.forEach((c) => {
      if (c.dia) {
        despesa += c.dia.totalDespesas ?? 0;
        net += netDoDia(c.dia);
      }
    });
    if (despesa > 0 || net !== 0)
      weeks.push({ label: `Semana ${weeks.length + 1}`, despesa, net, pct: 0 });
  }
  const maxDesp = Math.max(...weeks.map((w) => w.despesa), 1);
  return weeks.map((w) => ({ ...w, pct: (w.despesa / maxDesp) * 100 }));
};

/** É o dia de hoje? (compara com a data atual). */
export const isToday = (
  dia: DiaCalendario,
  ano: number,
  mes: number,
): boolean => {
  const hoje = new Date();
  return (
    hoje.getFullYear() === ano &&
    hoje.getMonth() + 1 === mes &&
    hoje.getDate() === dia.dia
  );
};

/** Fim de semana? (Dom/Sáb). */
export const isWeekend = (
  dia: DiaCalendario,
  ano: number,
  mes: number,
): boolean => {
  const dow = new Date(ano, mes - 1, dia.dia).getDay();
  return dow === 0 || dow === 6;
};

/** As primeiras N transações do dia (barrinhas). */
export const entradasDoDia = (
  dia: DiaCalendario,
  limite = 2,
): TransacaoCalendario[] => (dia.transacoes ?? []).slice(0, limite);
