import type { DiaCalendario } from "@/domain/models";

import { buildGrid, isToday, WEEK_DAYS } from "../calendar.helpers";
import { DayCell } from "./DayCell";

interface MonthCalendarGridProps {
  dias: DiaCalendario[];
  ano: number;
  mes: number; // 1-12
  diaSelecionado?: number;
  diasComConta: Set<number>;
  onDayClick: (dia: DiaCalendario) => void;
}

/** Grade mensal 7×N com legenda do mapa de calor e das contas. */
export const MonthCalendarGrid = ({
  dias,
  ano,
  mes,
  diaSelecionado,
  diasComConta,
  onDayClick,
}: MonthCalendarGridProps) => {
  const cells = buildGrid(dias, ano, mes);
  const maxGasto = Math.max(...dias.map((d) => d.totalDespesas ?? 0), 0);

  return (
    <div>
      <div className="mb-[6px] grid grid-cols-7 gap-[6px]">
        {WEEK_DAYS.map((d) => (
          <span
            key={d}
            className="py-1 text-center text-[12px] font-semibold text-fg2"
          >
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[6px]">
        {cells.map((cell, i) =>
          cell.empty || !cell.dia ? (
            <div key={i} />
          ) : (
            <DayCell
              key={cell.dia.data}
              dia={cell.dia}
              today={isToday(cell.dia, ano, mes)}
              selecionado={cell.dia.dia === diaSelecionado}
              temConta={diasComConta.has(cell.dia.dia)}
              maxGasto={maxGasto}
              onClick={() => onDayClick(cell.dia!)}
            />
          ),
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-fg2">
        <span className="flex items-center gap-[6px]">
          <span className="h-[10px] w-4 rounded-[3px] bg-danger/30" />
          quanto mais forte, mais gasto no dia
        </span>
        <span className="flex items-center gap-[6px]">
          <span className="size-[6px] rounded-full bg-warning" />
          conta para pagar
        </span>
      </div>
    </div>
  );
};
