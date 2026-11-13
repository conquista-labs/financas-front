import { Check, ChevronDown, Search } from "lucide-react";
import { useState } from "react";

import { normalizar } from "@/lib/lancamento";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui";

export interface OpcaoFiltro {
  value: string;
  label: string;
}

interface FilterChipProps {
  /** Nome do filtro ("Categoria"). Vira o texto do chip quando vazio. */
  label: string;
  value: string;
  options: OpcaoFiltro[];
  onChange: (value: string) => void;
  /** Mostra a busca no menu (listas longas). */
  busca?: boolean;
}

/**
 * Chip de filtro sempre à vista (protótipo v2): mostra o nome do filtro ou o
 * valor escolhido; abre um menu com busca opcional, "Limpar" e "Pronto".
 */
export const FilterChip = ({
  label,
  value,
  options,
  onChange,
  busca = false,
}: FilterChipProps) => {
  const [aberto, setAberto] = useState(false);
  const [termo, setTermo] = useState("");
  const atual = options.find((o) => o.value === value);
  const filtradas = termo
    ? options.filter((o) => normalizar(o.label).includes(normalizar(termo)))
    : options;

  return (
    <Popover
      open={aberto}
      onOpenChange={(o) => {
        setAberto(o);
        if (!o) setTermo("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-haspopup="listbox"
          className={cn(
            "flex h-[34px] max-w-[200px] items-center gap-1 rounded-full border px-3 text-[13px] font-semibold transition-colors",
            atual
              ? "border-primary bg-primary-soft text-primary-strong dark:text-[#B3A9FF]"
              : "border-line bg-card text-fg hover:border-primary/40",
          )}
        >
          <span className="truncate">{atual?.label ?? label}</span>
          <ChevronDown className="size-[14px] shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[280px] overflow-hidden p-0">
        {busca && (
          <div className="border-b border-line2 p-[10px]">
            <label className="flex h-9 items-center gap-2 rounded-[10px] border border-line px-[10px] focus-within:border-primary">
              <Search className="size-[14px] text-muted" />
              <input
                autoFocus
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder={`Buscar ${label.toLowerCase()}`}
                aria-label={`Buscar ${label.toLowerCase()}`}
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted"
              />
            </label>
          </div>
        )}
        <div
          role="listbox"
          aria-label={label}
          className="max-h-[260px] overflow-y-auto p-1"
        >
          {filtradas.map((o) => {
            const on = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => {
                  onChange(on ? "" : o.value);
                  setAberto(false);
                }}
                className="flex w-full items-center gap-2 rounded-[9px] px-[10px] py-2 text-left text-[13.5px] hover:bg-bg"
              >
                <span
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-[5px] border",
                    on ? "border-primary bg-primary text-white" : "border-line",
                  )}
                >
                  {on && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
              </button>
            );
          })}
          {!filtradas.length && (
            <p className="px-[10px] py-[14px] text-[12.5px] text-fg2">
              Nada encontrado.
            </p>
          )}
        </div>
        <div className="flex justify-between border-t border-line2 px-[10px] py-2">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setAberto(false);
            }}
            className="h-8 px-2 text-[13px] font-semibold text-fg2 hover:text-fg"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={() => setAberto(false)}
            className="h-8 rounded-[9px] bg-fg px-[14px] text-[13px] font-semibold text-card"
          >
            Pronto
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
