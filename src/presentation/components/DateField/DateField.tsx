import { format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

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
  /**
   * Renderiza o calendário sem portal. Use quando o DateField vive dentro de um
   * Sheet/Dialog Radix, senão o focus/pointer trap do Sheet bloqueia os cliques
   * nos dias (ver [[combobox-inline-overlay]]).
   */
  inline?: boolean;
}

/** ISO "yyyy-MM-dd" → texto "dd/MM/yyyy" (vazio se ISO inválido/ausente). */
const isoToText = (iso: string): string => {
  if (!iso) return "";
  const d = parse(iso, "yyyy-MM-dd", new Date());
  return isValid(d) ? format(d, "dd/MM/yyyy") : "";
};

/**
 * Aplica a máscara dd/MM/yyyy conforme o usuário digita: mantém só dígitos
 * (limite 8) e insere as barras nas posições certas.
 */
const maskDate = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)];
  return parts.filter(Boolean).join("/");
};

/**
 * Interpreta o texto "dd/MM/yyyy" completo como ISO válido. Retorna null se
 * ainda estiver incompleto ou não for uma data real (ex.: 31/02).
 */
const textToIso = (text: string): string | null => {
  if (text.length < 10) return null;
  const d = parse(text, "dd/MM/yyyy", new Date());
  return isValid(d) ? format(d, "yyyy-MM-dd") : null;
};

/**
 * Campo de data da nova identidade "Nossa Grana": input editável com máscara
 * dd/MM/yyyy + botão de calendário (react-day-picker) em popover. Dá para
 * digitar a data OU escolher no calendário — os dois ficam em sincronia.
 * Trabalha com datas ISO "yyyy-MM-dd" (o formato dos query params/API).
 */
export const DateField = ({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  className,
  inline = false,
}: DateFieldProps) => {
  const selected = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;

  // Texto do input: dirigido pelo `value` externo, mas editável localmente
  // enquanto o usuário digita uma data ainda incompleta.
  const [text, setText] = useState(() => isoToText(value));

  // Ressincroniza quando o valor externo muda (calendário, reset do form etc.).
  useEffect(() => {
    setText(isoToText(value));
  }, [value]);

  const handleType = (raw: string) => {
    const masked = maskDate(raw);
    setText(masked);
    const iso = textToIso(masked);
    if (iso) onChange(iso);
    else if (masked === "") onChange("");
  };

  // Ao sair do campo, se o texto não formou uma data válida, volta para o
  // último valor confirmado (ou vazio) — não deixa lixo no input.
  const handleBlur = () => {
    if (textToIso(text) === null && text !== "") setText(isoToText(value));
  };

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 rounded-[11px] border border-line bg-card px-3 text-sm leading-none text-fg transition-colors focus-within:border-primary hover:border-primary",
        className,
      )}
    >
      <input
        value={text}
        onChange={(e) => handleType(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        inputMode="numeric"
        aria-label="Data (dd/mm/aaaa)"
        className="min-w-0 flex-1 bg-transparent py-[11px] text-[length:inherit] text-fg outline-none placeholder:text-muted"
      />
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Abrir calendário"
            className="shrink-0 text-muted outline-none transition-colors hover:text-primary"
          >
            <CalendarIcon className="size-4" strokeWidth={1.9} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end" inline={inline}>
          <Calendar
            mode="single"
            locale={ptBR}
            selected={selected}
            onSelect={(date) =>
              onChange(date ? format(date, "yyyy-MM-dd") : "")
            }
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
