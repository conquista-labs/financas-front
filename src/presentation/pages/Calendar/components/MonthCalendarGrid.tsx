import type { DiaCalendario } from "@/domain/models";

import { buildGrid, isToday, isWeekend, WEEK_DAYS } from "../calendar.helpers";
import { DayCell } from "./DayCell";

interface MonthCalendarGridProps {
  dias: DiaCalendario[];
  ano: number;
  mes: number; // 1-12
  onDayClick: (dia: DiaCalendario) => void;
}

/** Grade mensal 7×N: cabeçalho de dias da semana + células. */
export const MonthCalendarGrid = ({
  dias,
  ano,
  mes,
  onDayClick,
}: MonthCalendarGridProps) => {
  const cells = buildGrid(dias, ano, mes);
  const maxGasto = Math.max(...dias.map((d) => d.totalDespesas ?? 0), 0);

  return (
    <div>
      {/* cabeçalho dos dias da semana */}
      <div className="mb-[6px] grid grid-cols-7 gap-[6px]">
        {WEEK_DAYS.map((d) => (
          <span
            key={d}
            className="py-1 text-center text-[12px] font-semibold text-muted"
          >
            {d}
          </span>
        ))}
      </div>

      {/* grade de dias */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell, i) =>
          cell.empty || !cell.dia ? (
            <div key={i} />
          ) : (
            <DayCell
              key={cell.dia.data}
              dia={cell.dia}
              today={isToday(cell.dia, ano, mes)}
              weekend={isWeekend(cell.dia, ano, mes)}
              maxGasto={maxGasto}
              onClick={() => onDayClick(cell.dia!)}
            />
          ),
        )}
      </div>
    </div>
  );
};
