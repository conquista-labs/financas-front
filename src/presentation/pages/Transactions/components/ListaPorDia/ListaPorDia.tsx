import { Check } from "lucide-react";
import { useState } from "react";

import type { TransacaoResponse } from "@/domain/models";
import { enhance } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import {
  agruparPorDia,
  chipsDaLinha,
  ehReceita,
  inicial,
  type TomChip,
} from "../../transactions.helpers";

/** Dias longos (ex.: fatura) mostram só os primeiros até "Ver mais". */
const POR_DIA = 5;

const TOM: Record<TomChip, string> = {
  primary: "bg-primary-soft text-primary-strong dark:text-[#B3A9FF]",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-track text-fg2",
};

interface ListaPorDiaProps {
  linhas: TransacaoResponse[];
  isLoading: boolean;
  selecionados: Set<string>;
  abertaId?: string;
  onToggle: (id: string) => void;
  onAbrir: (t: TransacaoResponse) => void;
  vazio: React.ReactNode;
  rodape: React.ReactNode;
}

/** Lista agrupada por dia (protótipo v2), com seleção e "Ver mais". */
export const ListaPorDia = ({
  linhas,
  isLoading,
  selecionados,
  abertaId,
  onToggle,
  onAbrir,
  vazio,
  rodape,
}: ListaPorDiaProps) => {
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const grupos = agruparPorDia(linhas);

  return (
    <section className="overflow-hidden rounded-[22px] border border-line bg-card">
      {isLoading ? (
        <div className="flex flex-col gap-2 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[52px] rounded-[12px]" />
          ))}
        </div>
      ) : !grupos.length ? (
        vazio
      ) : (
        grupos.map((g) => {
          const aberto = expandidos.has(g.data);
          const visiveis = aberto ? g.itens : g.itens.slice(0, POR_DIA);
          const resto = g.itens.length - visiveis.length;
          return (
            <div key={g.data}>
              <div className="flex justify-between gap-3 border-y border-line2 bg-card2 px-[18px] py-[10px] text-[12.5px] font-semibold text-fg2 first:border-t-0">
                <span className="truncate">{g.titulo}</span>
                <span
                  className={cn(
                    "shrink-0 tabular-nums",
                    g.total >= 0 ? "text-success" : "text-fg",
                  )}
                >
                  {g.total >= 0 ? "+ " : "- "}
                  {formatCurrency(Math.abs(g.total))}
                </span>
              </div>
              {visiveis.map((t) => {
                const sel = selecionados.has(t.id);
                const receita = ehReceita(t);
                const cor = enhance(t.categoria?.cor);
                return (
                  <div
                    key={t.id}
                    className={cn(
                      "flex items-center gap-3 border-b border-line2 px-[18px] py-[10px] last:border-0",
                      t.id === abertaId
                        ? "bg-primary-soft/60 shadow-[inset_3px_0_0_rgb(var(--primary))]"
                        : sel
                          ? "bg-primary-soft/30"
                          : "hover:bg-bg",
                    )}
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={sel}
                      aria-label={`Selecionar ${t.descricao}`}
                      onClick={() => onToggle(t.id)}
                      className={cn(
                        "grid size-[18px] shrink-0 place-items-center rounded-[5px] border",
                        sel
                          ? "border-primary bg-primary text-white"
                          : "border-line bg-card",
                      )}
                    >
                      {sel && <Check className="size-3" strokeWidth={3} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onAbrir(t)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-[11px] text-[13px] font-bold text-white"
                        style={{ backgroundColor: cor }}
                        aria-hidden
                      >
                        {inicial(t.descricao)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-[6px]">
                          <span
                            className="max-w-full truncate text-[14.5px] font-semibold"
                            title={t.descricao}
                          >
                            {t.descricao}
                          </span>
                          {chipsDaLinha(t).map((c) => (
                            <span
                              key={c.texto}
                              className={cn(
                                "rounded-full px-[7px] py-[1px] text-[11px] font-bold",
                                TOM[c.tom],
                              )}
                            >
                              {c.texto}
                            </span>
                          ))}
                        </span>
                        <span className="mt-[2px] block truncate text-[12.5px] text-fg2">
                          {[
                            t.categoria?.nome,
                            t.pessoa?.nome,
                            t.formaPagamento,
                            t.meioPagamento?.nome,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "shrink-0 font-display text-[15px] font-bold tabular-nums",
                          receita ? "text-success" : "text-fg",
                        )}
                      >
                        {receita ? "+ " : "- "}
                        {formatCurrency(t.valor)}
                      </span>
                    </button>
                  </div>
                );
              })}
              {resto > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setExpandidos((prev) => new Set(prev).add(g.data))
                  }
                  className="h-10 w-full border-b border-line2 bg-card2 text-[13px] font-semibold text-primary-strong hover:underline dark:text-[#B3A9FF]"
                >
                  Ver mais {resto} deste dia
                </button>
              )}
            </div>
          );
        })
      )}
      {rodape}
    </section>
  );
};
