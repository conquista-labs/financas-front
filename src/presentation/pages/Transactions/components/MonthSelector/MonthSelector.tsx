import { endOfMonth, format, isSameDay, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import {
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui";

interface MonthSelectorProps {
  /** Início do período selecionado. */
  startDate: Date;
  /** Fim do período (ausente = mês inteiro do startDate). */
  endDate?: Date;
  onPrev: () => void;
  onNext: () => void;
  /** Aplica um range de dias escolhido no calendário. */
  onRangeChange: (start: Date, end: Date) => void;
}

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/** Um período é "o mês inteiro" quando vai do 1º ao último dia do mesmo mês. */
const isMesInteiro = (start: Date, end?: Date) =>
  !end ||
  (isSameDay(start, startOfMonth(start)) && isSameDay(end, endOfMonth(start)));

/**
 * Seletor de período (‹ [rótulo] ›): as setas navegam mês a mês; clicar no
 * rótulo abre um calendário de intervalo para filtrar por dia(s). Mostra o
 * nome do mês quando é o mês inteiro, ou "dd MMM – dd MMM" quando é um recorte.
 */
export const MonthSelector = ({
  startDate,
  endDate,
  onPrev,
  onNext,
  onRangeChange,
}: MonthSelectorProps) => {
  const [open, setOpen] = useState(false);
  // Seleção em curso dentro do popover (independe do range já aplicado, para
  // o usuário poder recomeçar o intervalo do zero a cada abertura).
  const [range, setRange] = useState<DateRange | undefined>();

  const mesInteiro = isMesInteiro(startDate, endDate);
  const label = mesInteiro
    ? `${MONTHS[startDate.getMonth()]} ${startDate.getFullYear()}`
    : `${format(startDate, "dd MMM", { locale: ptBR })} – ${format(
        endDate ?? startDate,
        "dd MMM",
        { locale: ptBR },
      )}`;

  const openChange = (next: boolean) => {
    // Ao abrir, começa a seleção do zero (não herda o range aplicado), assim o
    // 1º clique define um novo início em vez de esticar o intervalo atual.
    if (next) setRange(undefined);
    setOpen(next);
  };

  const handleSelect = (r?: DateRange) => {
    setRange(r);
    if (!r?.from) return;
    // 1º clique (ainda não havia início) → só marca o começo e espera o fim,
    // mesmo que o day-picker devolva from===to. A partir do 2º clique (já
    // havia um início) aplica o intervalo e fecha.
    const jaTinhaInicio = !!range?.from;
    if (jaTinhaInicio && r.to) {
      onRangeChange(r.from, r.to);
      setOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Mês anterior"
        onClick={onPrev}
        className="grid size-9 place-items-center rounded-[11px] border border-line bg-card text-fg2 transition-colors hover:text-fg"
      >
        <ChevronLeft className="size-[18px]" strokeWidth={1.9} />
      </button>

      <Popover open={open} onOpenChange={openChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "min-w-[140px] rounded-[11px] border border-transparent px-2 py-[6px] text-center font-display text-[15px] font-semibold capitalize text-fg transition-colors hover:border-line",
              open && "border-primary",
            )}
          >
            {label}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="range"
            locale={ptBR}
            defaultMonth={startDate}
            selected={range}
            onSelect={handleSelect}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <button
        type="button"
        aria-label="Próximo mês"
        onClick={onNext}
        className="grid size-9 place-items-center rounded-[11px] border border-line bg-card text-fg2 transition-colors hover:text-fg"
      >
        <ChevronRight className="size-[18px]" strokeWidth={1.9} />
      </button>
    </div>
  );
};
