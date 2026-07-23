import { X } from "lucide-react";

import type { DiaCalendario } from "@/domain/models";
import { enhance } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui";

import { netDoDia } from "../calendar.helpers";

interface DayTransactionsDialogProps {
  dia: DiaCalendario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Modal com as transações de um dia + total. */
export const DayTransactionsDialog = ({
  dia,
  open,
  onOpenChange,
}: DayTransactionsDialogProps) => {
  const total = dia ? netDoDia(dia) : 0;
  const dateLabel = dia ? dia.data.split("-").reverse().join("/") : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="nice-scroll max-h-[82vh] max-w-[460px] gap-0 overflow-auto rounded-card border-line bg-card p-[22px]">
        <div className="mb-4 flex items-center justify-between">
          <DialogTitle className="font-display text-[19px] font-bold text-fg">
            Transações · {dateLabel}
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Fechar"
            className="grid size-[34px] place-items-center rounded-[10px] bg-bg text-fg2"
          >
            <X className="size-4" strokeWidth={2.2} />
          </button>
        </div>

        {!dia || dia.transacoes.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            Nenhuma transação neste dia.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {dia.transacoes.map((t) => {
              const receita = t.tipo === "receita";
              return (
                <div
                  key={t.id}
                  className="flex items-stretch gap-3 rounded-[12px] bg-bg p-[12px_14px]"
                >
                  <span
                    className="w-1 shrink-0 rounded-full"
                    style={{
                      backgroundColor: enhance(t.categoria?.cor ?? undefined),
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-semibold text-fg">
                      {t.descricao}
                    </p>
                    <p className="truncate text-[12px] text-muted">
                      {t.categoria?.nome}
                      {t.pessoa?.nome ? ` · ${t.pessoa.nome}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className="font-display text-[14.5px] font-bold"
                      style={{
                        color: receita
                          ? "rgb(var(--success))"
                          : "rgb(var(--danger))",
                      }}
                    >
                      {receita ? "+ " : "- "}
                      {formatCurrency(t.valor)}
                    </p>
                    {t.meioPagamento?.nome && (
                      <p className="text-[11.5px] text-muted">
                        {t.meioPagamento.nome}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* total do dia */}
            <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
              <span className="text-sm font-semibold text-fg2">
                Total do dia
              </span>
              <span
                className="font-display text-[18px] font-bold"
                style={{
                  color:
                    total >= 0 ? "rgb(var(--success))" : "rgb(var(--danger))",
                }}
              >
                {total >= 0 ? "+ " : "- "}
                {formatCurrency(Math.abs(total))}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
