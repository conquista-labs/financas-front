import { CalendarDays, Loader2, Trash2, Trophy } from "lucide-react";

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
    <article className="flex flex-col gap-3 rounded-[18px] bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
      <button
        type="button"
        onClick={() => onEdit(meta)}
        title="Editar meta"
        className="flex min-w-0 flex-col text-left"
      >
        <span className="truncate text-[15px] font-bold text-fg hover:text-primary">
          {meta.titulo}
        </span>
        <span className="mt-1 font-display text-[22px] font-bold -tracking-[0.02em] text-fg">
          {formatCurrency(meta.valorAlvo)}
        </span>
        <span className="mt-[2px] flex items-center gap-[6px] text-[12.5px] text-fg2">
          <CalendarDays className="size-[13px]" strokeWidth={2} />
          {quando} · {dono}
        </span>
      </button>
      <div className="flex gap-[6px]">
        <button
          type="button"
          onClick={() => onConcluir(meta)}
          className="flex h-[38px] flex-1 items-center justify-center gap-[6px] rounded-[11px] bg-fg text-[13.5px] font-bold text-card transition-opacity hover:opacity-90"
        >
          <Trophy className="size-[14px]" strokeWidth={2.2} />
          Concluir
        </button>
        <button
          type="button"
          aria-label="Arquivar meta"
          onClick={() => onArchive(meta)}
          disabled={isArchiving}
          className={`${iconBtn} size-[38px] rounded-[11px] border border-line bg-card text-fg2 hover:text-danger`}
        >
          {isArchiving ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2} />
          ) : (
            <Trash2 className="size-[15px]" strokeWidth={1.8} />
          )}
        </button>
      </div>
    </article>
  );
};
