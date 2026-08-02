import { Loader2, Pencil, Trash2 } from "lucide-react";

import type { MetaResponse } from "@/domain/models";
import { formatCurrency } from "@/lib/format";

import {
  mesAnoAlvo,
  progressRing,
  ringColorPorTipo,
  statusProgressoMeta,
} from "../goals.helpers";

interface MetaCardProps {
  meta: MetaResponse;
  /** true enquanto esta meta está sendo arquivada (spinner na lixeira). */
  isArchiving?: boolean;
  onOpen: (meta: MetaResponse) => void;
  onAporte: (meta: MetaResponse) => void;
  onEdit: (meta: MetaResponse) => void;
  onArchive: (meta: MetaResponse) => void;
}

const iconBtn =
  "grid size-8 shrink-0 place-items-center rounded-[9px] transition-colors disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Card de uma meta (layout horizontal do protótipo): anel de progresso
 * (conic-gradient — roxo p/ acumular, laranja p/ quitar), bloco de texto
 * clicável (título + tag "Dívida" + valor/alvo + status colorido) e ações
 * (Aportar em destaque, editar, arquivar). Anel 64/50 (7px de espessura).
 */
export const MetaCard = ({
  meta,
  isArchiving,
  onOpen,
  onAporte,
  onEdit,
  onArchive,
}: MetaCardProps) => {
  const st = statusProgressoMeta[meta.statusProgresso];
  const pct = Math.round(meta.percentual);
  const ring = ringColorPorTipo(meta.tipo);
  const isQuitar = meta.tipo === "quitar";
  const done = meta.statusProgresso === "concluida";
  const eta = done
    ? "objetivo batido"
    : `chega em ${mesAnoAlvo(meta.dataAlvo)}`;

  return (
    <div className="flex items-center gap-[18px] rounded-[20px] border border-line bg-card px-[22px] py-5">
      {/* Anel de progresso (donut) */}
      <div
        className="grid size-16 shrink-0 place-items-center rounded-full"
        style={{ background: progressRing(pct, ring) }}
      >
        <span className="grid size-[50px] place-items-center rounded-full bg-card">
          <span className="font-display text-[14px] font-bold text-fg">
            {pct}%
          </span>
        </span>
      </div>

      {/* Texto — abre o detalhe */}
      <button
        type="button"
        onClick={() => onOpen(meta)}
        title="Ver detalhes"
        className="flex min-w-0 flex-1 flex-col gap-[5px] text-left"
      >
        <span className="flex items-center gap-2">
          <span className="truncate text-[15.5px] font-semibold text-fg">
            {meta.titulo}
          </span>
          {isQuitar && (
            <span className="shrink-0 rounded-full bg-warning/10 px-[9px] py-[3px] text-[10.5px] font-bold text-warning">
              Dívida
            </span>
          )}
        </span>
        <span className="font-display text-[18px] font-bold -tracking-[0.02em] text-fg">
          {formatCurrency(meta.valorAtual)}
          <span className="ml-1 font-sans text-[13px] font-medium text-muted">
            de {formatCurrency(meta.valorAlvo)}
          </span>
        </span>
        <span className={`text-[12.5px] font-semibold ${st.text}`}>
          {st.label} · {eta}
        </span>
      </button>

      {/* Ações */}
      <div className="flex shrink-0 items-center gap-[6px]">
        <button
          type="button"
          onClick={() => onAporte(meta)}
          className="rounded-[10px] bg-primary/10 px-[15px] py-[9px] text-[13px] font-bold text-primary transition-colors hover:bg-primary/15"
        >
          Aportar
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
