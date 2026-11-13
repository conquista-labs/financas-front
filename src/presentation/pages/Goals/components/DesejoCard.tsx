import {
  CircleCheck,
  ExternalLink,
  Heart,
  Loader2,
  Target,
  Trash2,
} from "lucide-react";

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
  /** "Já realizei": conquistado sem virar meta. */
  onRealizar: (desejo: DesejoResponse) => void;
}

const iconBtn =
  "grid size-8 shrink-0 place-items-center rounded-[9px] transition-colors disabled:cursor-not-allowed disabled:opacity-60";

/** Rótulo amigável do link: só o host (sem www/protocolo); fallback = a URL. */
const linkLabel = (url: string): string => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/**
 * Card de um desejo (fiel ao protótipo): título + valor + badge de prioridade,
 * nota, chips de voto (coração + nome por pessoa, alterna ao clicar) com o selo
 * "os dois querem" (≥2 votos), e rodapé com "Virar meta", "Já realizei" e
 * editar/arquivar.
 */
export const DesejoCard = ({
  desejo,
  pessoas,
  isArchiving,
  onToggleVote,
  onPromote,
  onEdit,
  onArchive,
  onRealizar,
}: DesejoCardProps) => {
  const prio = prioridadeDesejo[desejo.prioridade];
  const votou = (pessoaId: string) =>
    desejo.votos.some((v) => v.pessoaId === pessoaId);
  const detalhe = [
    desejo.valorEstimado != null ? formatCurrency(desejo.valorEstimado) : null,
    desejo.nota || "sem nota",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex flex-col gap-[10px] rounded-[18px] bg-card px-4 py-[14px] shadow-[0_1px_2px_rgba(0,0,0,.04)]">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onEdit(desejo)}
          title="Editar desejo"
          className="min-w-0 text-left text-[15px] font-bold text-fg hover:text-primary"
        >
          {desejo.titulo}
        </button>
        <span
          className={cn(
            "shrink-0 rounded-full px-[9px] py-[3px] text-[11px] font-bold",
            prio.className,
          )}
        >
          {prio.label}
        </span>
      </div>
      <span className="-mt-1 text-[12.5px] text-fg2">{detalhe}</span>
      {desejo.link && (
        <a
          href={desejo.link}
          target="_blank"
          rel="noopener noreferrer"
          className="-mt-1 flex w-fit items-center gap-1 text-[12px] font-semibold text-primary hover:underline dark:text-[#B3A9FF]"
        >
          <ExternalLink className="size-3" strokeWidth={2} />
          <span className="max-w-[200px] truncate">
            {linkLabel(desejo.link)}
          </span>
        </a>
      )}

      <div className="flex flex-wrap items-center gap-[6px]">
        {pessoas.map((p) => {
          const ativo = votou(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onToggleVote(desejo, p.id)}
              aria-pressed={ativo}
              aria-label={`${p.nome} ${ativo ? "quer" : "não votou"}`}
              className={cn(
                "flex items-center gap-1 rounded-full border px-[9px] py-1 text-[12px] font-semibold transition-colors",
                ativo
                  ? "border-danger/30 bg-danger/10 text-danger"
                  : "border-line bg-card text-fg2 hover:border-danger/30",
              )}
            >
              <Heart
                className="size-3"
                strokeWidth={2.2}
                fill={ativo ? "currentColor" : "none"}
              />
              {p.nome}
            </button>
          );
        })}
        {desejo.votos.length >= 2 && (
          <span className="rounded-full bg-success/10 px-2 py-[2px] text-[11px] font-bold text-success">
            os dois querem
          </span>
        )}
      </div>

      <div className="flex gap-[6px]">
        <button
          type="button"
          onClick={() => onPromote(desejo)}
          className="flex h-[34px] flex-1 items-center justify-center gap-1 rounded-[10px] bg-primary-soft text-[13px] font-bold text-primary-strong hover:bg-primary-soft/70 dark:text-[#B3A9FF]"
        >
          <Target className="size-[13px]" strokeWidth={2.2} />
          Virar meta →
        </button>
        <button
          type="button"
          onClick={() => onRealizar(desejo)}
          className="flex h-[34px] flex-1 items-center justify-center gap-1 rounded-[10px] bg-success/10 text-[13px] font-bold text-success hover:bg-success/15"
        >
          <CircleCheck className="size-[13px]" strokeWidth={2.2} />
          Já realizei
        </button>
        <button
          type="button"
          aria-label="Arquivar desejo"
          onClick={() => onArchive(desejo)}
          disabled={isArchiving}
          className={`${iconBtn} size-[34px] bg-bg text-fg2 hover:bg-danger/10 hover:text-danger`}
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
