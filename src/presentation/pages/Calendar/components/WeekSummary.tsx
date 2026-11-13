import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { WeekSummary as WeekSummaryData } from "../calendar.helpers";

/** "Por semana": barra do gasto + saldo de cada semana do mês. */
export const WeekSummary = ({ weeks }: { weeks: WeekSummaryData[] }) => {
  if (weeks.length === 0) return null;

  return (
    <section className="rounded-[22px] border border-line bg-card p-5">
      <h2 className="mb-3 font-display text-lg font-bold">Por semana</h2>
      <div className="flex flex-col gap-[10px]">
        {weeks.map((w) => (
          <div key={w.label} className="flex items-center gap-3">
            <span className="w-[64px] shrink-0 text-[12.5px] font-semibold">
              {w.label}
            </span>
            <div
              className="h-2 flex-1 overflow-hidden rounded-full bg-track"
              title={`Gasto: ${formatCurrency(w.despesa)}`}
            >
              <div
                className="h-full rounded-full bg-danger"
                style={{ width: `${w.pct}%` }}
              />
            </div>
            <span
              className={cn(
                "w-[96px] shrink-0 text-right font-display text-[13px] font-bold tabular-nums",
                w.net >= 0 ? "text-success" : "text-danger",
              )}
            >
              {w.net >= 0 ? "+ " : "- "}
              {formatCurrency(Math.abs(w.net))}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
