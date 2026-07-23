import type { DiaCalendario } from "@/domain/models";
import { enhance } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

import { entradasDoDia, heatOpacity, netDoDia } from "../calendar.helpers";
import { dayCell } from "../calendar.styles";

interface DayCellProps {
  dia: DiaCalendario;
  today: boolean;
  weekend: boolean;
  maxGasto: number;
  onClick: () => void;
}

/** Célula de um dia: heatmap de gasto + número + net + até 2 entradas. */
export const DayCell = ({
  dia,
  today,
  weekend,
  maxGasto,
  onClick,
}: DayCellProps) => {
  const net = netDoDia(dia);
  const opacity = heatOpacity(dia.totalDespesas ?? 0, maxGasto);
  const entradas = entradasDoDia(dia);
  const extra = (dia.transacoes?.length ?? 0) - entradas.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className={dayCell({ today, weekend })}
    >
      {/* heatmap de gasto */}
      {opacity != null && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: `rgba(229,72,77,${opacity})` }}
        />
      )}

      {/* número + net */}
      <div className="relative flex items-center justify-between">
        <span
          className={cn(
            "text-[12.5px] font-bold",
            today ? "text-primary" : "text-fg2",
          )}
        >
          {dia.dia}
        </span>
        {dia.quantidadeTransacoes > 0 && (
          <span
            className={cn(
              "font-display text-[11px] font-bold",
              net >= 0 ? "text-success" : "text-danger",
            )}
          >
            {net >= 0 ? "+" : "-"}
            {formatCurrency(Math.abs(net))}
          </span>
        )}
      </div>

      {/* entradas */}
      <div className="relative flex flex-col gap-[3px]">
        {entradas.map((t) => (
          <div key={t.id} className="flex items-center gap-[5px]">
            <span
              className="h-3 w-[3px] shrink-0 rounded-[2px]"
              style={{
                backgroundColor: enhance(t.categoria?.cor ?? undefined),
              }}
            />
            <span className="truncate text-[10.5px] text-fg2">
              {t.descricao}
            </span>
          </div>
        ))}
        {extra > 0 && (
          <span className="text-[10px] font-semibold text-muted">
            +{extra} mais
          </span>
        )}
      </div>
    </button>
  );
};
