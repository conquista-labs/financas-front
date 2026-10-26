import { CalendarDays, Loader2, Pencil, Trash2, Trophy } from "lucide-react";

import type { MetaResponse } from "@/domain/models";
import { formatCurrency } from "@/lib/format";

import { mesAnoAlvo } from "../goals.helpers";

interface MetaCardProps {
  meta: MetaResponse;
  /** true enquanto esta meta está sendo arquivada (spinner na lixeira). */
  isArchiving?: boolean;
  onEdit: (meta: MetaResponse) => void;
  onArchive: (meta: MetaResponse) => void;
  /** "Concluir meta": conquistada (abre o modal com data/valor/compras). */
  onConcluir: (meta: MetaResponse) => void;
}

const iconBtn =
  "grid size-8 shrink-0 place-items-center rounded-[9px] transition-colors disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Card de uma meta — só o marco: título, valor, quando e de quem. Concluir
 * (troféu) em destaque; editar (clique no texto ou no lápis) e arquivar.
 */
export const MetaCard = ({
  meta,
  isArchiving,
  onEdit,
  onArchive,
  onConcluir,
}: MetaCardProps) => {
  const quando = meta.dataAlvo
    ? `até ${mesAnoAlvo(meta.dataAlvo)}`
    : "sem prazo";
  const dono = meta.pessoa?.nome ?? "Casal";

  return (
    <div className="flex items-center gap-4 rounded-[20px] border border-line bg-card px-[22px] py-5">
      <button
        type="button"
        onClick={() => onEdit(meta)}
        title="Editar meta"
        className="flex min-w-0 flex-1 flex-col gap-[5px] text-left"
      >
        <span className="truncate text-[15.5px] font-semibold text-fg">
          {meta.titulo}
        </span>
        <span className="font-display text-[20px] font-bold -tracking-[0.02em] text-fg">
          {formatCurrency(meta.valorAlvo)}
        </span>
        <span className="flex items-center gap-[6px] text-[12.5px] font-medium text-muted">
          <CalendarDays className="size-[13px]" strokeWidth={2} />
          {quando} · {dono}
        </span>
      </button>

      <div className="flex shrink-0 items-center gap-[6px]">
        <button
          type="button"
          onClick={() => onConcluir(meta)}
          className="flex items-center gap-[6px] rounded-[10px] bg-success/10 px-[13px] py-[9px] text-[13px] font-bold text-success transition-colors hover:bg-success/15"
        >
          <Trophy className="size-[14px]" strokeWidth={2.2} />
          Concluir
        </button>
        <button
          type="button"
          aria-label="Editar meta"
          onClick={() => onEdit(meta)}
          className={`${iconBtn} bg-bg text-fg2 hover:bg-track`}
        >
          <Pencil className="size-4" strokeWidth={1.8} />
        </button>
        <button
          type="button"
          aria-label="Arquivar meta"
          onClick={() => onArchive(meta)}
          disabled={isArchiving}
          className={`${iconBtn} bg-danger/10 text-danger hover:bg-danger/15`}
        >
          {isArchiving ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2} />
          ) : (
            <Trash2 className="size-4" strokeWidth={1.8} />
          )}
        </button>
      </div>
    </div>
  );
};
