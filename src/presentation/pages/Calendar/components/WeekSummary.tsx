import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { WeekSummary as WeekSummaryData } from "../calendar.helpers";

interface WeekSummaryProps {
  weeks: WeekSummaryData[];
}

/** "Resumo por semana" — barra de despesa + net por semana (abaixo da grade). */
export const WeekSummary = ({ weeks }: WeekSummaryProps) => {
  if (weeks.length === 0) return null;

  return (
    <div className="mt-[18px] border-t border-line2 pt-4">
      <p className="mb-3 text-[12.5px] font-semibold text-muted">
        Resumo por semana
      </p>
      <div className="flex flex-col gap-[10px]">
        {weeks.map((w) => (
          <div key={w.label} className="flex items-center gap-3">
            <span className="w-[82px] shrink-0 text-[12.5px] text-fg2">
              {w.label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-pill bg-track">
              <div
                className="h-full rounded-pill bg-danger"
                style={{ width: `${w.pct}%` }}
              />
            </div>
            <span className="w-[90px] shrink-0 text-right text-[12px] text-muted">
              {formatCurrency(w.despesa)}
            </span>
            <span
              className={cn(
                "w-[92px] shrink-0 text-right font-display text-[12.5px] font-bold",
                w.net >= 0 ? "text-success" : "text-danger",
              )}
            >
              {w.net >= 0 ? "+" : "-"}
              {formatCurrency(Math.abs(w.net))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
