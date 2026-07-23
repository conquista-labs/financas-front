import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

import type { EvolucaoPoint } from "../patrimony.helpers";

interface EvolucaoChartProps {
  points: EvolucaoPoint[];
  isLoading?: boolean;
}

/** Cores das 3 séries (fiéis ao protótipo). */
const COLORS = {
  ativos: "#12A66A",
  liquido: "#3B82F6",
  passivos: "#E5484D",
};

interface TooltipInput {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: TooltipInput) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as EvolucaoPoint;
  return (
    <div className="rounded-[10px] border border-line bg-card px-3 py-2 text-xs shadow-modal">
      <p className="mb-1 font-semibold text-fg">{row.mes}</p>
      <Row color={COLORS.ativos} label="Ativos" value={row.ativos} />
      <Row color={COLORS.liquido} label="Líquido" value={row.liquido} />
      <Row color={COLORS.passivos} label="Passivos" value={row.passivos} />
    </div>
  );
};

const Row = ({
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
      className="h-[3px] w-[14px] rounded-[2px]"
      style={{ backgroundColor: color }}
    />
    {label}:{" "}
    <span className="font-semibold text-fg">{formatCurrency(value)}</span>
  </p>
);

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <span className="flex items-center gap-[6px] text-[12.5px] text-fg2">
    <span
      className="h-[3px] w-[14px] rounded-[2px]"
      style={{ backgroundColor: color }}
    />
    {label}
  </span>
);

/**
 * "Evolução do patrimônio" — line chart com 3 séries (Ativos/Líquido/Passivos)
 * ao longo dos meses. Recharts tematizado + tooltip e legenda próprios.
 */
export const EvolucaoChart = ({ points, isLoading }: EvolucaoChartProps) => (
  <div className="rounded-[20px] border border-line bg-card p-5">
    <h3 className="font-display text-[17px] font-semibold text-fg">
      Evolução do patrimônio
    </h3>

    {isLoading ? (
      <Skeleton className="mt-4 h-[180px] rounded-[12px]" />
    ) : (
      <>
        <div className="mt-3 h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={points}
              margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="rgb(var(--line))"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="mes"
                tick={{ fill: "rgb(var(--muted))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgb(var(--line))" }}
              />
              <Line
                type="monotone"
                dataKey="ativos"
                stroke={COLORS.ativos}
                strokeWidth={2.2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="liquido"
                stroke={COLORS.liquido}
                strokeWidth={2.2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="passivos"
                stroke={COLORS.passivos}
                strokeWidth={2.2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-wrap gap-4">
          <LegendItem color={COLORS.ativos} label="Ativos" />
          <LegendItem color={COLORS.liquido} label="Líquido" />
          <LegendItem color={COLORS.passivos} label="Passivos" />
        </div>
      </>
    )}
  </div>
);
