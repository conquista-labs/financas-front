import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import type { SaldosPorMes } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

import { panel } from "../../home.styles";

interface IncomeExpenseChartProps {
  rows?: SaldosPorMes[];
  isLoading?: boolean;
}

/** Cores do protótipo para as séries. */
const COLORS = {
  receita: "#7FBF7A",
  saldoAnt: "#79B0D4",
  despesa: "#E5646A",
};

const MES_LABEL = (mes?: string) => {
  // "2026-07" → "07/26"
  if (!mes) return "";
  const [ano, m] = mes.split("-");
  return `${m}/${ano.slice(2)}`;
};

interface ChartRow {
  label: string;
  receita: number;
  saldoAnt: number;
  despesa: number;
}

interface TooltipInput {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: TooltipInput) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as ChartRow;
  return (
    <div className="rounded-[10px] border border-line bg-card px-3 py-2 text-xs shadow-modal">
      <p className="mb-1 font-semibold text-fg">{row.label}</p>
      <Line color={COLORS.receita} label="Receitas" value={row.receita} />
      <Line color={COLORS.saldoAnt} label="Saldo ant." value={row.saldoAnt} />
      <Line color={COLORS.despesa} label="Despesas" value={row.despesa} />
    </div>
  );
};

const Line = ({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) => (
  <p className="flex items-center gap-[6px] text-fg2">
    <span
      className="size-[9px] rounded-[3px]"
      style={{ backgroundColor: color }}
    />
    {label}:{" "}
    <span className="font-semibold text-fg">{formatCurrency(value)}</span>
  </p>
);

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <span className="flex items-center gap-[6px] text-[11px] text-muted">
    <span
      className="size-[11px] rounded-[3px]"
      style={{ backgroundColor: color }}
    />
    {label}
  </span>
);

/**
 * Bar chart "Receitas e despesas" (12 meses). Coluna esquerda = saldo anterior
 * empilhado sobre receitas; coluna direita = despesas. Recharts tematizado com
 * as cores do protótipo + tooltip próprio.
 */
export const IncomeExpenseChart = ({
  rows,
  isLoading,
}: IncomeExpenseChartProps) => {
  if (isLoading || !rows)
    return <Skeleton className="h-[300px] rounded-card" />;

  const data: ChartRow[] = rows.map((r) => ({
    label: MES_LABEL(r.mes),
    receita: r.receita ?? 0,
    saldoAnt: r.saldoMesAnterior ?? 0,
    despesa: r.despesa ?? 0,
  }));

  return (
    <div className={panel()}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-[17px] font-bold text-fg">
          Receitas e despesas
        </h2>
        <div className="flex gap-3">
          <LegendItem color={COLORS.receita} label="Receitas" />
          <LegendItem color={COLORS.saldoAnt} label="Saldo anterior" />
          <LegendItem color={COLORS.despesa} label="Despesas" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} barGap={2} barCategoryGap="18%">
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10.5, fill: "rgb(var(--muted))" }}
          />
          <Tooltip
            // Sem cursor: as barras são finas (maxBarSize 14) mas a "categoria"
            // do mês é larga, então o retângulo de hover padrão fica largo e
            // desalinhado. O tooltip aparece igual ao passar o mouse.
            cursor={false}
            content={<CustomTooltip />}
          />
          {/* coluna esquerda: receita (base) + saldo anterior (topo) */}
          <Bar
            dataKey="receita"
            stackId="entrada"
            fill={COLORS.receita}
            radius={[0, 0, 0, 0]}
            maxBarSize={14}
          />
          <Bar
            dataKey="saldoAnt"
            stackId="entrada"
            fill={COLORS.saldoAnt}
            radius={[4, 4, 0, 0]}
            maxBarSize={14}
          />
          {/* coluna direita: despesa */}
          <Bar
            dataKey="despesa"
            fill={COLORS.despesa}
            radius={[4, 4, 0, 0]}
            maxBarSize={14}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
