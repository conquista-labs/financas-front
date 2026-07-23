import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
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

/**
 * Seletor de mês (‹ [Mês Ano] ›) da nova identidade. Navega o período
 * (startDate/endDate) da lista de transações.
 */
export const MonthSelector = ({ date, onPrev, onNext }: MonthSelectorProps) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      aria-label="Mês anterior"
      onClick={onPrev}
      className="grid size-9 place-items-center rounded-[11px] border border-line bg-card text-fg2 transition-colors hover:text-fg"
    >
      <ChevronLeft className="size-[18px]" strokeWidth={1.9} />
    </button>
    <span className="min-w-[130px] text-center font-display text-[15px] font-semibold text-fg">
      {MONTHS[date.getMonth()]} {date.getFullYear()}
    </span>
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
