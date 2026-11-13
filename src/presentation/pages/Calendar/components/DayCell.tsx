import type { DiaCalendario } from "@/domain/models";
import { cn } from "@/lib/utils";

import { valorCurto } from "../agenda.helpers";
import { heatOpacity, netDoDia } from "../calendar.helpers";

interface DayCellProps {
  dia: DiaCalendario;
  today: boolean;
  selecionado: boolean;
  temConta: boolean;
  maxGasto: number;
  onClick: () => void;
}

/**
 * Célula de um dia (protótipo v2): número, bolinha se há conta a pagar e o
 * saldo do dia em formato curto. O fundo fica mais vermelho quanto maior o
 * gasto do dia.
 */
export const DayCell = ({
  dia,
  today,
  selecionado,
  temConta,
  maxGasto,
  onClick,
}: DayCellProps) => {
  const net = netDoDia(dia);
  const opacity = heatOpacity(dia.totalDespesas ?? 0, maxGasto);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selecionado}
      aria-label={`Dia ${dia.dia}${temConta ? ", com conta a pagar" : ""}`}
      className={cn(
        "relative flex min-h-[64px] flex-col justify-between overflow-hidden rounded-[12px] border bg-card p-2 text-left transition-colors hover:border-primary/50",
        selecionado ? "border-2 border-fg" : "border-line",
      )}
    >
      {opacity != null && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: `rgba(229,72,77,${opacity})` }}
        />
      )}
      <span className="relative flex items-center justify-between">
        <span
          className={cn(
            "text-[13px] font-bold",
            today
              ? "grid size-6 place-items-center rounded-full bg-primary text-white"
              : "text-fg",
          )}
        >
          {dia.dia}
        </span>
        {temConta && (
          <span className="size-[6px] rounded-full bg-warning" aria-hidden />
        )}
      </span>
      {dia.quantidadeTransacoes > 0 && (
        <span
          className={cn(
            "relative font-display text-[11.5px] font-bold tabular-nums",
            net >= 0 ? "text-success" : "text-danger",
          )}
        >
          {valorCurto(net)}
        </span>
      )}
    </button>
  );
};
