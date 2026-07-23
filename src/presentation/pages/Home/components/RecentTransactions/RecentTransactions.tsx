import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { TransacaoResponse } from "@/domain/models";
import { enhance } from "@/lib/color";
import { formatCurrency, formatDayMonth } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";
import { urlRouters } from "@/presentation/router/router.definitions";

import { panel } from "../../home.styles";

interface RecentTransactionsProps {
  rows?: TransacaoResponse[];
  isLoading?: boolean;
}

/** É receita? (categoria do tipo receita). */
const isReceita = (t: TransacaoResponse) => t.categoria?.tipo === "receita";

/**
 * "Últimos lançamentos" — as 6 transações mais recentes. Ícone tile tintado
 * com a cor da categoria, descrição + meta (categoria · pessoa), valor e data.
 */
export const RecentTransactions = ({
  rows,
  isLoading,
}: RecentTransactionsProps) => (
  <div className={panel()}>
    <div className="mb-1 flex items-center justify-between">
      <h2 className="font-display text-[17px] font-bold text-fg">
        Últimos lançamentos
      </h2>
      <Link
        to={urlRouters.transactions}
        className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary-strong"
      >
        Ver tudo <ArrowRight className="size-[14px]" strokeWidth={2.2} />
      </Link>
    </div>

    {isLoading || !rows ? (
      <div className="space-y-2 py-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    ) : rows.length === 0 ? (
      <p className="py-8 text-center text-sm text-muted">
        Nenhum lançamento ainda.
      </p>
    ) : (
      <div>
        {rows.slice(0, 6).map((t) => {
          const cor = enhance(t.categoria?.cor);
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 border-b border-line2 py-[14px] last:border-0"
            >
              <span
                className="grid size-10 shrink-0 place-items-center rounded-xl"
                style={{ backgroundColor: `${cor}22` }}
              >
                <span
                  className="size-[13px] rounded-full"
                  style={{ backgroundColor: cor }}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-semibold text-fg">
                  {t.descricao}
                </p>
                <p className="truncate text-[12.5px] text-muted">
                  {t.categoria?.nome}
                  {t.pessoa?.nome ? ` · ${t.pessoa.nome}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className="font-display text-[15px] font-semibold"
                  style={{
                    color: isReceita(t) ? "rgb(var(--success))" : undefined,
                  }}
                >
                  {isReceita(t) ? "+ " : ""}
                  {formatCurrency(t.valor)}
                </p>
                <p className="text-[12px] text-muted">
                  {formatDayMonth(t.data)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
