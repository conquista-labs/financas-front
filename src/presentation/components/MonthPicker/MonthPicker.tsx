import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui";

interface MonthPickerProps {
  /** Mês selecionado (1-12). */
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const MESES_LONG = [
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

const MESES_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const navButton =
  "grid size-[38px] place-items-center rounded-[11px] border border-line bg-card text-fg2 transition-colors hover:border-primary/40";

/**
 * Seletor de mês/ano: setas ‹ › (mês a mês) + o rótulo abre um Popover com
 * grade 3×4 de meses e navegação de ano — para pular vários meses/anos sem
 * dezenas de cliques. Reutilizável (dash, transações, etc.).
 */
export const MonthPicker = ({ month, year, onChange }: MonthPickerProps) => {
  const [open, setOpen] = useState(false);
  // Ano exibido na grade do popover (pode diferir do selecionado enquanto navega).
  const [viewYear, setViewYear] = useState(year);

  const step = (dir: -1 | 1) => {
    let m = month + dir;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    onChange(m, y);
  };

  const pick = (m: number) => {
    onChange(m, viewYear);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Mês anterior"
        onClick={() => step(-1)}
        className={navButton}
      >
        <ChevronLeft className="size-[18px]" />
      </button>

      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o) setViewYear(year);
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className="min-w-[150px] rounded-[11px] border border-line bg-card px-[14px] py-[9px] text-center text-[15px] font-semibold text-fg transition-colors hover:border-primary/40"
          >
            {MESES_LONG[month - 1]} {year}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[248px] p-3">
          {/* Navegação de ano */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Ano anterior"
              onClick={() => setViewYear((y) => y - 1)}
              className="grid size-8 place-items-center rounded-lg text-fg2 hover:bg-track"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="font-display text-sm font-bold text-fg">
              {viewYear}
            </span>
            <button
              type="button"
              aria-label="Próximo ano"
              onClick={() => setViewYear((y) => y + 1)}
              className="grid size-8 place-items-center rounded-lg text-fg2 hover:bg-track"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Grade de meses */}
          <div className="grid grid-cols-3 gap-[6px]">
            {MESES_SHORT.map((label, i) => {
              const m = i + 1;
              const selected = m === month && viewYear === year;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => pick(m)}
                  className={cn(
                    "rounded-[9px] py-2 text-[13px] font-semibold transition-colors",
                    selected
                      ? "bg-primary text-white"
                      : "text-fg2 hover:bg-track",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <button
        type="button"
        aria-label="Próximo mês"
        onClick={() => step(1)}
        className={navButton}
      >
        <ChevronRight className="size-[18px]" />
      </button>
    </div>
  );
};
