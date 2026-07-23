import { Pencil, Trash2 } from "lucide-react";

import type { Pessoa } from "@/domain/models";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import { rowAction } from "../registers.styles";
import { FavoriteButton } from "./FavoriteButton";
import type { RegisterItem } from "./RegisterFormDialog";

interface PessoaListProps {
  rows: Pessoa[];
  isLoading?: boolean;
  onEdit: (item: RegisterItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorito: (id: string, favorito: boolean) => void;
}

/** Iniciais (2 letras) para o avatar. */
const initials = (nome: string) =>
  nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Lista de pessoas (cards em grid, avatar com iniciais). */
export const PessoaList = ({
  rows,
  isLoading,
  onEdit,
  onDelete,
  onToggleFavorito,
}: PessoaListProps) => {
  if (isLoading)
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[78px] min-w-[250px] flex-1 rounded-2xl"
          />
        ))}
      </div>
    );

  if (!rows.length)
    return (
      <p className="py-12 text-center text-sm text-muted">
        Nenhuma pessoa cadastrada.
      </p>
    );

  return (
    <div className="flex flex-wrap gap-3">
      {rows.map((pes) => (
        <div
          key={pes.id}
          className="flex items-center gap-3 rounded-2xl border border-line bg-card p-[18px]"
        >
          <span
            className="grid size-[42px] shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg,#5B4BE0,#9B7BEA)",
            }}
          >
            {initials(pes.nome)}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-fg">{pes.nome}</p>
            <p className="max-w-[200px] truncate text-[12.5px] text-muted">
              {pes.totalLancamentos} lançamento
              {pes.totalLancamentos === 1 ? "" : "s"}
              {pes.email ? ` · ${pes.email}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 gap-[5px]">
            <FavoriteButton
              favorito={pes.favorito}
              onToggle={() => onToggleFavorito(pes.id, !pes.favorito)}
            />
            <button
              type="button"
              aria-label="Editar"
              className={rowAction()}
              onClick={() =>
                onEdit({
                  id: pes.id,
                  nome: pes.nome,
                  email: pes.email,
                  favorito: pes.favorito,
                })
              }
            >
              <Pencil className="size-4" strokeWidth={1.9} />
            </button>
            <button
              type="button"
              aria-label="Excluir"
              onClick={() => onDelete(pes.id)}
              className={cn(
                rowAction(),
                "bg-danger/10 text-danger hover:bg-danger/15",
              )}
            >
              <Trash2 className="size-4" strokeWidth={1.9} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
