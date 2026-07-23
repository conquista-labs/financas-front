import { Pencil, Trash2 } from "lucide-react";

import type { Patrimonio } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import { delta, mesAno } from "../patrimony.helpers";

interface PatrimonioListProps {
  rows: Patrimonio[];
  isLoading?: boolean;
  onEdit: (item: Patrimonio) => void;
  onDelete: (item: Patrimonio) => void;
}

const actionBtn =
  "grid size-8 place-items-center rounded-[9px] transition-colors";

/**
 * Lista de itens de patrimônio (card único). Cada linha: tag Ativo/Passivo,
 * descrição + "categoria · desde MM/AAAA", valor + variação (verde/vermelho) e
 * ações editar/excluir.
 */
export const PatrimonioList = ({
  rows,
  isLoading,
  onEdit,
  onDelete,
}: PatrimonioListProps) => {
  if (isLoading)
    return (
      <div className="rounded-[20px] border border-line bg-card px-[22px] py-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (!rows.length)
    return (
      <div className="rounded-[20px] border border-dashed border-line bg-card/50 px-6 py-16 text-center">
        <p className="text-sm font-semibold text-fg">Nenhum patrimônio ainda</p>
        <p className="mt-1 text-sm text-muted">
          Adicione seus bens e dívidas para acompanhar seu patrimônio líquido.
        </p>
      </div>
    );

  return (
    <div className="rounded-[20px] border border-line bg-card px-[22px] pb-3 pt-[6px]">
      {rows.map((item) => {
        const isAtivo = item.tipo === "ativo";
        const d = delta(item);
        const semVariacao = !item.valorInicial;
        return (
          <div
            key={item.id}
            className="flex items-center gap-[14px] border-b border-line2 py-[15px] last:border-0"
          >
            {/* Tag tipo */}
            <span
              className={cn(
                "shrink-0 rounded-full px-[10px] py-1 text-[11px] font-bold",
                isAtivo
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger",
              )}
            >
              {isAtivo ? "Ativo" : "Passivo"}
            </span>

            {/* Descrição + meta */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-fg">
                {item.descricao}
              </p>
              <p className="text-[12.5px] text-muted">
                {item.categoriaFormatada} · desde {mesAno(item.dataAquisicao)}
              </p>
            </div>

            {/* Valor + variação */}
            <div className="shrink-0 text-right">
              <p className="font-display text-[15.5px] font-semibold text-fg">
                {formatCurrency(item.valorAtual)}
              </p>
              {!semVariacao && (
                <p
                  className={cn(
                    "text-[12px] font-semibold",
                    d >= 0 ? "text-success" : "text-danger",
                  )}
                >
                  {d >= 0 ? "+ " : "- "}
                  {formatCurrency(Math.abs(d))}
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="flex shrink-0 gap-[5px]">
              <button
                type="button"
                aria-label="Editar"
                onClick={() => onEdit(item)}
                className={cn(actionBtn, "bg-bg text-fg2 hover:bg-track")}
              >
                <Pencil className="size-4" strokeWidth={1.9} />
              </button>
              <button
                type="button"
                aria-label="Excluir"
                onClick={() => onDelete(item)}
                className={cn(
                  actionBtn,
                  "bg-danger/10 text-danger hover:bg-danger/15",
                )}
              >
                <Trash2 className="size-4" strokeWidth={1.9} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
