import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { DiaCalendario } from "@/domain/models";
import { enhance } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

import { netDoDia } from "../calendar.helpers";

/** O dia escolhido na grade: total e lançamentos (abaixo do calendário). */
export const DiaDetalhe = ({
  dia,
  ano,
  mes,
}: {
  dia: DiaCalendario;
  ano: number;
  mes: number;
}) => {
  const net = netDoDia(dia);
  const titulo = format(new Date(ano, mes - 1, dia.dia), "EEEE, d 'de' MMMM", {
    locale: ptBR,
  }).replace("-feira", "");

  return (
    <div className="mt-4 rounded-[16px] bg-bg px-4 py-[14px]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[14.5px] font-bold first-letter:uppercase">
          {titulo}
        </p>
        {dia.quantidadeTransacoes > 0 && (
          <p
            className={cn(
              "font-display text-[14.5px] font-bold tabular-nums",
              net >= 0 ? "text-success" : "text-danger",
            )}
          >
            Total do dia {net >= 0 ? "+" : "-"} {formatCurrency(Math.abs(net))}
          </p>
        )}
      </div>
      {dia.transacoes.length === 0 ? (
        <p className="mt-2 text-[13px] text-fg2">
          Nenhum lançamento neste dia.
        </p>
      ) : (
        <ul className="mt-2 flex flex-col">
          {dia.transacoes.map((t) => {
            const receita = t.tipo === "receita";
            return (
              <li
                key={t.id}
                className="flex items-center gap-3 border-b border-line2 py-[9px] last:border-0"
              >
                <span
                  className="h-5 w-[3px] shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: enhance(t.categoria?.cor ?? undefined),
                  }}
                />
                <span className="min-w-0 flex-1 truncate text-[13.5px]">
                  <strong className="font-semibold">{t.descricao}</strong>
                  <span className="text-fg2">
                    {[t.pessoa?.nome, t.meioPagamento?.nome]
                      .filter(Boolean)
                      .map((x) => ` · ${x}`)
                      .join("")}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 font-display text-[13.5px] font-bold tabular-nums",
                    receita ? "text-success" : "text-fg",
                  )}
                >
                  {receita ? "+ " : "- "}
                  {formatCurrency(t.valor)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
