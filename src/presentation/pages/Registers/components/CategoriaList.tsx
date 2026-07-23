import { Pencil, Trash2 } from "lucide-react";

import type { Categoria } from "@/domain/models";
import { enhance } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ScrollListCard } from "@/presentation/components";
import { Skeleton } from "@/presentation/components/ui";

import { rowAction, typeBadge } from "../registers.styles";
import { FavoriteButton } from "./FavoriteButton";
import type { RegisterItem } from "./RegisterFormDialog";

interface CategoriaListProps {
  rows: Categoria[];
  isLoading?: boolean;
  onEdit: (item: RegisterItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorito: (id: string, favorito: boolean) => void;
}

/** Lista de categorias (card único, fiel ao protótipo). */
export const CategoriaList = ({
  rows,
  isLoading,
  onEdit,
  onDelete,
  onToggleFavorito,
}: CategoriaListProps) => (
  <ScrollListCard
    isLoading={isLoading}
    isEmpty={!rows.length}
    emptyState={
      <p className="py-12 text-center text-sm text-muted">
        Nenhuma categoria cadastrada.
      </p>
    }
    skeleton={
      <div className="space-y-3 py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    }
  >
    {rows.map((cat) => {
      const isExpense = cat.tipo === "despesa";
      return (
        <div
          key={cat.id}
          className="flex items-center gap-[14px] border-b border-line2 py-[15px] last:border-0"
        >
          <span
            className="size-[30px] shrink-0 rounded-full border-2 border-card"
            style={{
              backgroundColor: enhance(cat.cor),
              boxShadow: "0 0 0 1px rgb(var(--line))",
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-fg">
              {cat.nome}
            </p>
            <p className="text-[12.5px] text-muted">
              {cat.totalLancamentos} lançamento
              {cat.totalLancamentos === 1 ? "" : "s"} ·{" "}
              {cat.tetoGasto
                ? `Teto ${formatCurrency(cat.tetoGasto)}`
                : "Sem teto"}
            </p>
          </div>
          <span
            className={typeBadge({ tipo: isExpense ? "despesa" : "receita" })}
          >
            {isExpense ? "Despesa" : "Receita"}
          </span>
          <div className="flex shrink-0 gap-[5px]">
            <FavoriteButton
              favorito={cat.favorito}
              onToggle={() => onToggleFavorito(cat.id, !cat.favorito)}
            />
            <button
              type="button"
              aria-label="Editar"
              className={rowAction()}
              onClick={() =>
                onEdit({
                  id: cat.id,
                  nome: cat.nome,
                  tipo: cat.tipo,
                  tetoGasto: cat.tetoGasto,
                  cor: cat.cor,
                  favorito: cat.favorito,
                })
              }
            >
              <Pencil className="size-4" strokeWidth={1.9} />
            </button>
            <button
              type="button"
              aria-label="Excluir"
              onClick={() => onDelete(cat.id)}
              className={cn(
                rowAction(),
                "bg-danger/10 text-danger hover:bg-danger/15",
              )}
            >
              <Trash2 className="size-4" strokeWidth={1.9} />
            </button>
          </div>
        </div>
      );
    })}
  </ScrollListCard>
);
