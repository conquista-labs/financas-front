import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui";

interface DateFieldProps {
  /** Valor no formato ISO "yyyy-MM-dd" (ou vazio). */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Campo de data da nova identidade "Nossa Grana": botão que abre um calendário
 * shadcn (react-day-picker) em popover. Trabalha com datas ISO "yyyy-MM-dd" (o
 * formato dos query params/API) e exibe em pt-BR "dd/MM/yyyy".
 * (Nomeado DateField para não colidir com o DatePicker legado RarUI.)
 */
export const DateField = ({
  value,
  onChange,
  placeholder = "Selecionar",
  className,
}: DateFieldProps) => {
  const selected = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-[11px] border border-line bg-card px-3 py-[11px] text-sm text-fg outline-none transition-colors hover:border-primary",
            !selected && "text-muted",
            className,
          )}
        >
          <CalendarIcon
            className="size-4 shrink-0 text-muted"
            strokeWidth={1.9}
          />
          {selected ? format(selected, "dd/MM/yyyy") : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={selected}
          onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
};
