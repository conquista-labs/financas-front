import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import type { CalendarKpiData } from "../calendar.helpers";

interface CalendarKpisProps {
  kpis: CalendarKpiData;
  isLoading?: boolean;
}

/** 4 KPIs do mês no topo do calendário (Receitas, Despesas, Saldo, Maior gasto). */
export const CalendarKpis = ({ kpis, isLoading }: CalendarKpisProps) => {
  if (isLoading)
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[84px] rounded-[16px]" />
        ))}
      </div>
    );

  const saldoPositivo = kpis.saldo >= 0;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Kpi
        label="Receitas"
        value={formatCurrency(kpis.receitas)}
        color="text-success"
      />
      <Kpi
        label="Despesas"
        value={formatCurrency(kpis.despesas)}
        color="text-danger"
      />
      <Kpi
        label="Saldo do mês"
        value={formatCurrency(kpis.saldo)}
        color={saldoPositivo ? "text-success" : "text-danger"}
      />
      <Kpi
        label="Maior gasto"
        value={formatCurrency(kpis.maiorGasto)}
        sub={kpis.maiorGastoDia ? `dia ${kpis.maiorGastoDia}` : undefined}
        color="text-fg"
      />
    </div>
  );
};

const Kpi = ({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color: string;
  sub?: string;
}) => (
  <div className="rounded-[16px] border border-line bg-card px-[18px] py-4">
    <p className="text-[12.5px] font-semibold text-muted">{label}</p>
    <p className={cn("font-display text-[20px] font-bold", color)}>
      {value}
      {sub && (
        <span className="ml-1 text-[12px] font-normal text-muted">· {sub}</span>
      )}
    </p>
  </div>
);
