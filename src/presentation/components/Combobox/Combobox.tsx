import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverTrigger,
} from "@/presentation/components/ui";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Placeholder do campo de busca. */
  searchPlaceholder?: string;
  emptyMessage?: string;
  /**
   * Se definido, adiciona uma opção no topo que zera o valor (`""`). Usado
   * em filtros ("Todas", "Todos") — o texto também vira o placeholder do
   * trigger quando nada está selecionado.
   */
  clearLabel?: string;
  /**
   * Renderiza o dropdown SEM portal (inline). Necessário quando o Combobox
   * vive dentro de outro overlay Radix (Sheet/Dialog): com portal, o foco do
   * campo de busca é sequestrado pelo focus trap do overlay pai. Ver
   * FiltersSheet.
   */
  inline?: boolean;
  className?: string;
  /**
   * Classe extra no dropdown (Popover content). Útil para dar largura mínima
   * maior que o trigger quando ele é estreito, evitando que as opções fiquem
   * espremidas/quebradas (ex.: selects compactos da revisão de importação).
   */
  contentClassName?: string;
}

const contentCls =
  "z-50 w-[--radix-popover-trigger-width] overflow-hidden rounded-xl border border-line bg-popover p-0 text-popover-foreground shadow-[0_18px_44px_-18px_rgba(0,0,0,.28)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95";

/**
 * Select com busca (typeahead). Mesma aparência do trigger dos selects do
 * form, mas abre um Popover com campo de busca — útil onde há muitos itens
 * (Categoria, Meio de pagamento). Filtra por label.
 */
export const Combobox = ({
  options,
  value,
  onChange,
  placeholder = "Selecione",
  searchPlaceholder = "Buscar…",
  emptyMessage = "Nada encontrado.",
  clearLabel,
  inline = false,
  className,
  contentClassName,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  const select = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  const content = (
    <PopoverPrimitive.Content
      align="start"
      sideOffset={4}
      className={cn(contentCls, contentClassName)}
    >
      <Command>
        <CommandInput placeholder={searchPlaceholder} />
        <CommandList>
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {clearLabel && (
              <CommandItem
                value={clearLabel}
                onSelect={() => select("")}
                className={cn(
                  !value && "bg-primary/soft font-semibold text-primary-strong",
                )}
              >
                <Check
                  className={cn(
                    "size-[15px]",
                    !value ? "text-primary-strong opacity-100" : "opacity-0",
                  )}
                  strokeWidth={2.4}
                />
                {clearLabel}
              </CommandItem>
            )}
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => select(option.value)}
                  className={cn(
                    isSelected &&
                      "bg-primary/soft font-semibold text-primary-strong",
                  )}
                >
                  <Check
                    className={cn(
                      "size-[15px]",
                      isSelected
                        ? "text-primary-strong opacity-100"
                        : "opacity-0",
                    )}
                    strokeWidth={2.4}
                  />
                  {option.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverPrimitive.Content>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-[11px] border border-line bg-card px-3 py-[11px] text-sm outline-none",
            selected ? "text-fg" : "text-muted",
            className,
          )}
        >
          <span className="truncate">
            {selected?.label ?? clearLabel ?? placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted" />
        </button>
      </PopoverTrigger>
      {inline ? (
        content
      ) : (
        <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>
      )}
    </Popover>
  );
};
