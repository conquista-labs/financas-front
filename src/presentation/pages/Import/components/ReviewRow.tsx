import { AlertTriangle, Check, Pencil } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Combobox,
  type ComboboxOption,
  DateField,
} from "@/presentation/components";

import { isoDate, numParcelas, type ReviewLine } from "../import.helpers";

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
  // Nº total de parcelas (a linha da fatura é sempre a 1ª; futuras = projeção).
  const parcelas = numParcelas(line.formaPagamento);
  const futuras = parcelas > 1 ? parcelas - 1 : 0;

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

        <DateField
          value={isoDate(line.data)}
          onChange={(v) => onChange({ data: v })}
          className="w-[132px] shrink-0 !py-[7px] text-[12.5px]"
        />

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

      {/* Fileira 3: propagação de parcelas (só quando parcelado, N≥2) */}
      {parcelas >= 2 && (
        <div className="mt-2 flex flex-wrap items-center gap-[10px] pl-[76px]">
          <span className="rounded-full bg-primary/soft px-[9px] py-1 text-[11px] font-bold text-primary-strong">
            Parcela 1/{parcelas}
          </span>

          <div className="flex gap-[5px] rounded-[11px] bg-track p-1">
            <button
              type="button"
              onClick={() => onChange({ propagarParcelas: false })}
              className={cn(
                "rounded-[9px] px-3 py-[7px] text-[12px] font-semibold transition-colors",
                !line.propagarParcelas
                  ? "bg-card text-primary-strong shadow-[0_2px_6px_rgba(0,0,0,.08)]"
                  : "text-muted",
              )}
            >
              Só a deste mês
            </button>
            <button
              type="button"
              onClick={() => onChange({ propagarParcelas: true })}
              className={cn(
                "rounded-[9px] px-3 py-[7px] text-[12px] font-semibold transition-colors",
                line.propagarParcelas
                  ? "bg-card text-primary-strong shadow-[0_2px_6px_rgba(0,0,0,.08)]"
                  : "text-muted",
              )}
            >
              Criar as {futuras} futuras
            </button>
          </div>

          <span className="text-[11.5px] text-muted">
            {line.propagarParcelas
              ? `Cria ${futuras} lançamento${futuras === 1 ? "" : "s"} futuro${futuras === 1 ? "" : "s"} de ${formatCurrency(line.valor)} como pendentes, um por mês.`
              : "Só a parcela deste mês. As futuras podem ser importadas depois."}
          </span>
        </div>
      )}
    </div>
  );
};
