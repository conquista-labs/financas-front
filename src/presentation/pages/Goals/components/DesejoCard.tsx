import { Heart, Loader2, Pencil, Target, Trash2 } from "lucide-react";

import type { DesejoResponse, Pessoa } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

import { prioridadeDesejo } from "../goals.helpers";

interface DesejoCardProps {
  desejo: DesejoResponse;
  /** Pessoas ativas — um chip de voto (coração + nome) por pessoa. */
  pessoas: Pessoa[];
  isArchiving?: boolean;
  onToggleVote: (desejo: DesejoResponse, pessoaId: string) => void;
  onPromote: (desejo: DesejoResponse) => void;
  onEdit: (desejo: DesejoResponse) => void;
  onArchive: (desejo: DesejoResponse) => void;
}

const iconBtn =
  "grid size-8 shrink-0 place-items-center rounded-[9px] transition-colors disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Card de um desejo (fiel ao protótipo): título + valor + badge de prioridade,
 * nota, chips de voto (coração + nome por pessoa, alterna ao clicar) com o selo
 * "os dois querem" (≥2 votos), e rodapé com "Virar meta" + editar/arquivar.
 */
export const DesejoCard = ({
  desejo,
  pessoas,
  isArchiving,
  onToggleVote,
  onPromote,
  onEdit,
  onArchive,
}: DesejoCardProps) => {
  const prio = prioridadeDesejo[desejo.prioridade];
  const votou = (pessoaId: string) =>
    desejo.votos.some((v) => v.pessoaId === pessoaId);

  return (
    <div className="flex flex-col gap-3 rounded-[20px] border border-line bg-card px-[22px] py-5">
      {/* Topo: título + valor + prioridade */}
      <div className="flex items-start justify-between gap-[10px]">
        <div className="min-w-0">
          <p className="truncate text-[15.5px] font-semibold text-fg">
            {desejo.titulo}
          </p>
          {desejo.valorEstimado != null && (
            <p className="mt-1 font-display text-[22px] font-bold -tracking-[0.02em] text-fg">
              {formatCurrency(desejo.valorEstimado)}
            </p>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-[10px] py-1 text-[10.5px] font-bold",
            prio.className,
          )}
        >
          {prio.label}
        </span>
      </div>

      {/* Nota */}
      <p className="text-[12.5px] text-muted">{desejo.nota || "Sem nota"}</p>

      {/* Votos + selo */}
      <div className="flex flex-wrap items-center gap-2">
        {pessoas.map((p) => {
          const ativo = votou(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onToggleVote(desejo, p.id)}
              aria-pressed={ativo}
              className={cn(
                "flex items-center gap-[6px] rounded-full border px-[13px] py-[7px] text-[12.5px] font-semibold transition-colors",
                ativo
                  ? "border-primary bg-primary/soft text-primary"
                  : "border-line bg-card text-fg2 hover:border-primary/40",
              )}
            >
              <Heart
                className="size-[14px]"
                strokeWidth={2}
                fill={ativo ? "currentColor" : "none"}
              />
              {p.nome}
            </button>
          );
        })}
        {desejo.votos.length >= 2 && (
          <span className="rounded-full bg-primary/soft px-[10px] py-1 text-[11px] font-bold text-primary">
            os dois querem
          </span>
        )}
      </div>

      {/* Rodapé */}
      <div className="flex items-center justify-between gap-[10px] border-t border-line2 pt-3">
        <button
          type="button"
          onClick={() => onPromote(desejo)}
          className="flex items-center gap-[6px] rounded-[10px] bg-primary px-[14px] py-[9px] text-[13px] font-bold text-white transition-colors hover:bg-primary-strong"
        >
          <Target className="size-[14px]" strokeWidth={2.2} />
          Virar meta
        </button>
        <div className="flex gap-[6px]">
          <button
            type="button"
            aria-label="Editar desejo"
            onClick={() => onEdit(desejo)}
            className={`${iconBtn} bg-bg text-fg2 hover:bg-track`}
          >
            <Pencil className="size-4" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            aria-label="Arquivar desejo"
            onClick={() => onArchive(desejo)}
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
    </div>
  );
};
