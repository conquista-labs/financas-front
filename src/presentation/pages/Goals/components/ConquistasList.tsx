import { Heart, Loader2, RotateCcw, Trophy } from "lucide-react";

import type { DesejoResponse, MetaResponse } from "@/domain/models";
import { formatCurrency } from "@/lib/format";

import { dataCurta } from "../goals.helpers";

interface ConquistasListProps {
  metas: MetaResponse[];
  desejos: DesejoResponse[];
  /** id da meta/desejo sendo reaberto (spinner no botão). */
  reabrindo?: string | null;
  onReabrirMeta: (meta: MetaResponse) => void;
  onReabrirDesejo: (desejo: DesejoResponse) => void;
}

type Item =
  | { tipo: "meta"; data: string; meta: MetaResponse }
  | { tipo: "desejo"; data: string; desejo: DesejoResponse };

/**
 * Coluna "Conquistado": metas concluídas e desejos realizados, do mais recente para
 * o mais antigo, com quanto custou (ou o alvo) e "Reabrir" (marcou por engano).
 */
export const ConquistasList = ({
  metas,
  desejos,
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
      <div className="flex flex-col gap-[10px]">
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
          const compras = item.tipo === "meta" ? (item.meta.compras ?? []) : [];
          return (
            <div
              key={`${item.tipo}-${id}`}
              className="flex items-start gap-3 rounded-[18px] bg-card px-4 py-[14px] shadow-[0_1px_2px_rgba(0,0,0,.04)]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-success/10 text-success">
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
                    <span className="rounded-full bg-primary-soft px-2 py-[1px] text-[10.5px] font-bold text-primary-strong dark:text-[#B3A9FF]">
                      desejo
                    </span>
                  )}
                </p>
                <p className="text-[12.5px] text-fg2">
                  {item.tipo === "meta" ? "Conquistada" : "Realizado"} em{" "}
                  {dataCurta(item.data)} · {detalhe}
                </p>
                {compras.length > 0 && (
                  <p className="truncate text-[12px] text-fg2">
                    → {compras[0].descricao}
                    {compras.length > 1
                      ? ` · ${compras.length} parcelas (${dataCurta(compras[0].data)} a ${dataCurta(compras[compras.length - 1].data)})`
                      : ` em ${dataCurta(compras[0].data)}`}
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
