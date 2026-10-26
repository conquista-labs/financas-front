import { Heart, Loader2, RotateCcw, Trophy } from "lucide-react";

import type { DesejoResponse, MetaResponse } from "@/domain/models";
import { formatCurrency } from "@/lib/format";

import { dataCurta } from "../goals.helpers";

interface ConquistasListProps {
  metas: MetaResponse[];
  desejos: DesejoResponse[];
  resumo?: { ano: number; quantidade: number; valor: number };
  /** id da meta/desejo sendo reaberto (spinner no botão). */
  reabrindo?: string | null;
  onReabrirMeta: (meta: MetaResponse) => void;
  onReabrirDesejo: (desejo: DesejoResponse) => void;
}

type Item =
  | { tipo: "meta"; data: string; meta: MetaResponse }
  | { tipo: "desejo"; data: string; desejo: DesejoResponse };

/**
 * Aba Conquistas: metas concluídas e desejos realizados, do mais recente para
 * o mais antigo, com quanto custou (ou o alvo) e "Reabrir" (marcou por engano).
 * No topo, o resumo do ano.
 */
export const ConquistasList = ({
  metas,
  desejos,
  resumo,
  reabrindo,
  onReabrirMeta,
  onReabrirDesejo,
}: ConquistasListProps) => {
  const itens: Item[] = [
    ...metas.map((meta) => ({
      tipo: "meta" as const,
      data: meta.concluidaEm ?? "",
      meta,
    })),
    ...desejos.map((desejo) => ({
      tipo: "desejo" as const,
      data: desejo.realizadoEm ?? "",
      desejo,
    })),
  ].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div>
      {resumo && resumo.quantidade > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-[16px] bg-success/10 px-5 py-4">
          <Trophy className="size-5 text-success" strokeWidth={2} />
          <p className="text-[14px] font-semibold text-fg">
            {resumo.ano}: {resumo.quantidade} conquista
            {resumo.quantidade === 1 ? "" : "s"} ·{" "}
            {formatCurrency(resumo.valor)} realizados
          </p>
        </div>
      )}
      <div className="grid gap-3 lg:grid-cols-2">
        {itens.map((item) => {
          const id = item.tipo === "meta" ? item.meta.id : item.desejo.id;
          const titulo =
            item.tipo === "meta" ? item.meta.titulo : item.desejo.titulo;
          const valor =
            item.tipo === "meta"
              ? (item.meta.valorFinal ?? item.meta.valorAlvo)
              : (item.desejo.valorFinal ?? item.desejo.valorEstimado ?? 0);
          const detalhe =
            item.tipo === "meta"
              ? item.meta.valorFinal != null
                ? `custou ${formatCurrency(item.meta.valorFinal)} (alvo ${formatCurrency(item.meta.valorAlvo)})`
                : `alvo ${formatCurrency(item.meta.valorAlvo)}`
              : formatCurrency(valor);
          const compra = item.tipo === "meta" ? item.meta.compra : null;
          return (
            <div
              key={`${item.tipo}-${id}`}
              className="flex items-center gap-3 rounded-[18px] border border-line bg-card px-5 py-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                {item.tipo === "meta" ? (
                  <Trophy className="size-[18px]" strokeWidth={2} />
                ) : (
                  <Heart className="size-[18px]" strokeWidth={2} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate text-[14.5px] font-semibold text-fg">
                  {titulo}
                  {item.tipo === "desejo" && (
                    <span className="rounded-full bg-primary/10 px-2 py-[1px] text-[10.5px] font-bold text-primary">
                      desejo
                    </span>
                  )}
                </p>
                <p className="truncate text-[12.5px] text-muted">
                  {item.tipo === "meta" ? "Conquistada" : "Realizado"} em{" "}
                  {dataCurta(item.data)} · {detalhe}
                </p>
                {compra && (
                  <p className="truncate text-[12px] text-fg2">
                    → {compra.descricao} em {dataCurta(compra.data)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  item.tipo === "meta"
                    ? onReabrirMeta(item.meta)
                    : onReabrirDesejo(item.desejo)
                }
                disabled={reabrindo === id}
                title="Marcou por engano? Volta para em andamento."
                className="flex shrink-0 items-center gap-1 rounded-[9px] bg-bg px-[10px] py-[7px] text-[12px] font-semibold text-fg2 transition-colors hover:bg-track disabled:opacity-60"
              >
                {reabrindo === id ? (
                  <Loader2
                    className="size-[13px] animate-spin"
                    strokeWidth={2}
                  />
                ) : (
                  <RotateCcw className="size-[13px]" strokeWidth={2} />
                )}
                Reabrir
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
