import { Check } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

import { isoDate } from "../extrato/extrato.helpers";
import type { ItemFila } from "../revisar.fila";
import { diaMes } from "../revisar.helpers";

interface FilaItemProps {
  item: ItemFila;
  /** Categoria efetiva (escolhida ou sugerida) e se ela é só sugestão. */
  categoria?: { nome: string; sugerida: boolean };
  ativo: boolean;
  selecionado: boolean;
  ocupado: boolean;
  onAbrir: () => void;
  onToggle: () => void;
}

/** Uma linha da fila do Revisar: origem, descrição, valor e categoria. */
export const FilaItem = ({
  item,
  categoria,
  ativo,
  selecionado,
  ocupado,
  onAbrir,
  onToggle,
}: FilaItemProps) => {
  const banco = item.origem === "banco" ? item.banco : undefined;
  const extrato = item.origem === "extrato" ? item.extrato : undefined;
  const descricao = banco?.descricao ?? extrato!.descricao;
  const valor = banco?.valor ?? extrato!.valor;
  const receita = (banco?.tipo ?? extrato!.tipo) === "receita";
  const data = banco?.data ?? isoDate(extrato!.data);
  const fonte = banco ? (banco.banco ?? banco.conta.nome) : "Extrato";

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-line2 px-[14px] py-[10px] transition-colors",
        ativo
          ? "bg-primary-soft/70 shadow-[inset_3px_0_0_rgb(var(--primary))]"
          : "hover:bg-bg",
        ocupado && "opacity-50",
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={selecionado}
        aria-label={`Selecionar ${descricao}`}
        onClick={onToggle}
        className={cn(
          "grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors",
          selecionado
            ? "border-primary bg-primary text-white"
            : "border-line bg-card",
        )}
      >
        {selecionado && <Check className="size-3" strokeWidth={3} />}
      </button>
      <button
        type="button"
        onClick={onAbrir}
        aria-current={ativo || undefined}
        className="flex min-w-0 flex-1 items-center gap-[10px] text-left"
      >
        <span className="min-w-0 flex-1">
          <span
            title={banco?.descricaoOriginal ?? descricao}
            className="block truncate text-sm font-semibold text-fg"
          >
            {descricao}
          </span>
          <span className="mt-[2px] flex items-center gap-[6px] text-xs text-fg2">
            <span
              className={cn(
                "rounded-[5px] px-[6px] py-[1px] text-[11px] font-bold",
                extrato
                  ? "bg-primary-soft text-primary-strong dark:text-[#B3A9FF]"
                  : "bg-track text-fg2",
              )}
            >
              {fonte}
            </span>
            <span className="truncate">{diaMes(data)}</span>
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span
            className={cn(
              "block font-display text-sm font-bold tabular-nums",
              receita ? "text-success" : "text-fg",
            )}
          >
            {receita ? "+ " : "- "}
            {formatCurrency(valor)}
          </span>
          <span
            className={cn(
              "block text-[11.5px] font-semibold",
              !categoria
                ? "text-warning"
                : categoria.sugerida
                  ? "text-primary dark:text-[#B3A9FF]"
                  : "text-fg2",
            )}
          >
            {categoria?.nome ?? "Sem categoria"}
          </span>
        </span>
      </button>
    </div>
  );
};
