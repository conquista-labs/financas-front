import { AlertTriangle, Check, Pencil } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Combobox, type ComboboxOption } from "@/presentation/components";

import { type ReviewLine, shortDate } from "../import.helpers";

interface ReviewRowProps {
  line: ReviewLine;
  categorias: ComboboxOption[];
  pessoas: ComboboxOption[];
  meios: ComboboxOption[];
  formas: ComboboxOption[];
  onToggle: () => void;
  onChange: (patch: Partial<ReviewLine>) => void;
}

/** Trigger dos selects da revisão — visual do protótipo (radius 9px, compacto). */
const selectCls =
  "!rounded-[9px] !border-line !px-[9px] !py-[7px] !text-[12.5px]";
/** Dropdown com largura mínima confortável (o trigger é estreito). */
const dropdownCls = "min-w-[210px]";

/**
 * Uma transação detectada, editável. Não é `<td>`: é uma linha flex com
 * checkbox de inclusão, data, descrição editável (input + lápis) e selects de
 * categoria/pessoa (fileira 1) + meio/forma (fileira 2). Todos os selects têm
 * busca (Combobox). Duplicadas ganham fundo âmbar; excluídas esmaecem.
 */
export const ReviewRow = ({
  line,
  categorias,
  pessoas,
  meios,
  formas,
  onToggle,
  onChange,
}: ReviewRowProps) => {
  const isReceita = line.tipo === "receita";

  return (
    <div
      className={cn(
        "border-b border-line2 py-[13px] transition-colors",
        line.possivelDuplicada && line.incluir && "bg-warning/5",
        !line.incluir && "opacity-50",
      )}
    >
      {/* Fileira 1: seleção + data + descrição + categoria/pessoa + valor */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={line.incluir}
          aria-label={line.incluir ? "Não importar" : "Importar"}
          onClick={onToggle}
          className={cn(
            "grid size-[22px] shrink-0 place-items-center rounded-[7px] border-2 transition-colors",
            line.incluir
              ? "border-primary bg-primary text-white"
              : "border-line bg-transparent",
          )}
        >
          {line.incluir && <Check className="size-[13px]" strokeWidth={3} />}
        </button>

        <span className="w-[42px] shrink-0 text-[12.5px] font-semibold text-muted">
          {shortDate(line.data)}
        </span>

        <div className="min-w-0 flex-1">
          {/* Descrição editável — input com ícone de lápis */}
          <div className="group relative">
            <input
              value={line.descricao}
              onChange={(e) => onChange({ descricao: e.target.value })}
              aria-label="Descrição da transação"
              className="w-full truncate rounded-[9px] border border-transparent bg-transparent py-[5px] pl-2 pr-7 text-[14px] font-semibold text-fg outline-none transition-colors hover:border-line focus:border-primary focus:bg-card"
            />
            <Pencil
              className="pointer-events-none absolute right-2 top-1/2 size-[13px] -translate-y-1/2 text-muted opacity-0 transition-opacity group-hover:opacity-100"
              strokeWidth={1.9}
            />
          </div>
          {line.possivelDuplicada && (
            <span className="mt-[2px] flex items-center gap-1 pl-2 text-[11.5px] font-semibold text-warning">
              <AlertTriangle className="size-3" strokeWidth={2} />
              Parece já lançada
            </span>
          )}
        </div>

        <Combobox
          options={categorias}
          value={line.categoriaId}
          onChange={(v) => onChange({ categoriaId: v })}
          placeholder="Categoria"
          searchPlaceholder="Buscar categoria…"
          className={cn(selectCls, "w-[132px] shrink-0")}
          contentClassName={dropdownCls}
        />
        <Combobox
          options={pessoas}
          value={line.pessoaId}
          onChange={(v) => onChange({ pessoaId: v })}
          placeholder="Pessoa"
          clearLabel="Ninguém"
          searchPlaceholder="Buscar pessoa…"
          className={cn(selectCls, "w-[116px] shrink-0")}
          contentClassName={dropdownCls}
        />

        <span
          className={cn(
            "w-[108px] shrink-0 text-right font-display text-[14.5px] font-semibold",
            isReceita ? "text-success" : "text-fg",
          )}
        >
          {isReceita ? "+ " : "- "}
          {formatCurrency(line.valor)}
        </span>
      </div>

      {/* Fileira 2: meio + forma de pagamento (indentada 76px) */}
      <div className="mt-2 flex items-center gap-2 pl-[76px]">
        <span className="text-[11.5px] font-semibold text-muted">
          Pagamento:
        </span>
        <Combobox
          options={meios}
          value={line.meioPagamentoId}
          onChange={(v) => onChange({ meioPagamentoId: v })}
          placeholder="Meio"
          clearLabel="Não informado"
          searchPlaceholder="Buscar meio…"
          className={cn(selectCls, "w-[190px] shrink-0 !text-fg2")}
          contentClassName={dropdownCls}
        />
        <Combobox
          options={formas}
          value={line.formaPagamento}
          onChange={(v) => onChange({ formaPagamento: v })}
          placeholder="Forma"
          searchPlaceholder="Buscar forma…"
          className={cn(selectCls, "w-[150px] shrink-0 !text-fg2")}
          contentClassName={dropdownCls}
        />
      </div>
    </div>
  );
};
