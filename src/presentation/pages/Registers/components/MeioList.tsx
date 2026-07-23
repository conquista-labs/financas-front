import { CreditCard, Pencil, Trash2 } from "lucide-react";

import type { MeioPagamento } from "@/domain/models";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import { rowAction } from "../registers.styles";
import { FavoriteButton } from "./FavoriteButton";
import type { RegisterItem } from "./RegisterFormDialog";

interface MeioListProps {
  rows: MeioPagamento[];
  isLoading?: boolean;
  onEdit: (item: RegisterItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorito: (id: string, favorito: boolean) => void;
}

/** Lista de meios de pagamento (chips compactos em grid). */
export const MeioList = ({
  rows,
  isLoading,
  onEdit,
  onDelete,
  onToggleFavorito,
}: MeioListProps) => {
  if (isLoading)
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[54px] w-[220px] rounded-2xl" />
        ))}
      </div>
    );

  if (!rows.length)
    return (
      <p className="py-12 text-center text-sm text-muted">
        Nenhum meio de pagamento cadastrado.
      </p>
    );

  return (
    <div className="flex flex-wrap gap-3">
      {rows.map((meio) => (
        <div
          key={meio.id}
          className="flex items-center gap-[10px] rounded-2xl border border-line bg-card px-5 py-4 text-[14.5px] font-semibold"
        >
          <CreditCard
            className="size-[18px] shrink-0 text-primary"
            strokeWidth={1.9}
          />
          <div className="flex-1">
            <span className="block text-fg">{meio.nome}</span>
            <span className="block text-[11.5px] font-medium text-muted">
              {meio.totalLancamentos} lançamento
              {meio.totalLancamentos === 1 ? "" : "s"}
            </span>
          </div>
          <div className="flex shrink-0 gap-[5px]">
            <FavoriteButton
              size="sm"
              favorito={meio.favorito}
              onToggle={() => onToggleFavorito(meio.id, !meio.favorito)}
            />
            <button
              type="button"
              aria-label="Editar"
              className={rowAction({ size: "sm" })}
              onClick={() =>
                onEdit({
                  id: meio.id,
                  nome: meio.nome,
                  favorito: meio.favorito,
                })
              }
            >
              <Pencil className="size-[15px]" strokeWidth={1.9} />
            </button>
            <button
              type="button"
              aria-label="Excluir"
              onClick={() => onDelete(meio.id)}
              className={cn(
                rowAction({ size: "sm" }),
                "bg-danger/10 text-danger hover:bg-danger/15",
              )}
            >
              <Trash2 className="size-[15px]" strokeWidth={1.9} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
