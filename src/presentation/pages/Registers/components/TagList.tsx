import { Check, Hash, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

import type { Tag } from "@/domain/models";
import { cn } from "@/lib/utils";

import { rowAction } from "../registers.styles";

interface TagListProps {
  rows: Tag[];
  isLoading?: boolean;
  onRename: (id: string, nome: string) => void;
  onDelete: (tag: Tag) => void;
}

/**
 * Lista de tags (chips em grid). Tags não são criadas aqui (nascem ao lançar
 * uma transação) — só dá pra renomear (inline) e excluir. Renomear/excluir
 * propaga a todas as transações.
 */
export const TagList = ({
  rows,
  isLoading,
  onRename,
  onDelete,
}: TagListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setDraft(tag.nome);
  };

  const commit = (tag: Tag) => {
    const nome = draft.trim();
    if (nome && nome !== tag.nome) onRename(tag.id, nome);
    setEditingId(null);
  };

  if (isLoading)
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[46px] w-[160px] animate-pulse rounded-2xl bg-track"
          />
        ))}
      </div>
    );

  if (!rows.length)
    return (
      <div className="rounded-card border border-dashed border-line bg-card/50 px-6 py-16 text-center">
        <p className="text-sm font-semibold text-fg">Nenhuma tag ainda</p>
        <p className="mt-1 text-sm text-muted">
          As tags são criadas ao lançar uma transação. Quando existirem, você
          poderá renomeá-las ou excluí-las aqui.
        </p>
      </div>
    );

  return (
    <div className="flex flex-wrap gap-3">
      {rows.map((tag) => {
        const isEditing = editingId === tag.id;
        return (
          <div
            key={tag.id}
            className="flex items-center gap-[10px] rounded-2xl border border-line bg-card px-4 py-3"
          >
            <Hash
              className="size-[16px] shrink-0 text-primary"
              strokeWidth={2}
            />

            {isEditing ? (
              <input
                value={draft}
                autoFocus
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit(tag);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="w-[120px] rounded-[8px] border border-primary bg-card px-2 py-1 text-[14px] font-semibold text-fg outline-none"
              />
            ) : (
              <div className="flex-1">
                <span className="block text-[14.5px] font-semibold text-fg">
                  {tag.nome}
                </span>
                <span className="block text-[11.5px] font-medium text-muted">
                  {tag.count} transaç{tag.count === 1 ? "ão" : "ões"}
                </span>
              </div>
            )}

            <div className="flex shrink-0 gap-[5px]">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    aria-label="Salvar"
                    onClick={() => commit(tag)}
                    className={cn(
                      rowAction({ size: "sm" }),
                      "bg-primary/10 text-primary hover:bg-primary/15",
                    )}
                  >
                    <Check className="size-[15px]" strokeWidth={2.4} />
                  </button>
                  <button
                    type="button"
                    aria-label="Cancelar"
                    onClick={() => setEditingId(null)}
                    className={rowAction({ size: "sm" })}
                  >
                    <X className="size-[15px]" strokeWidth={2.2} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    aria-label="Renomear"
                    onClick={() => startEdit(tag)}
                    className={rowAction({ size: "sm" })}
                  >
                    <Pencil className="size-[15px]" strokeWidth={1.9} />
                  </button>
                  <button
                    type="button"
                    aria-label="Excluir"
                    onClick={() => onDelete(tag)}
                    className={cn(
                      rowAction({ size: "sm" }),
                      "bg-danger/10 text-danger hover:bg-danger/15",
                    )}
                  >
                    <Trash2 className="size-[15px]" strokeWidth={1.9} />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
