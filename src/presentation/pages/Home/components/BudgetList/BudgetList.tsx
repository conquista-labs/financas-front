import type { OrcamentoCategoriaDto } from "@/domain/models";
import { enhance } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

import { panel } from "../../home.styles";

interface BudgetListProps {
  rows?: OrcamentoCategoriaDto[];
  isLoading?: boolean;
}

/**
 * "Orçamento por categoria" — barras de progresso (CSS puro). Top 6 por % de
 * utilização. Barra fica vermelha quando estoura o teto; senão usa a cor da
 * categoria (enhanced). Dados prontos do analytics de orçamento.
 */
export const BudgetList = ({ rows, isLoading }: BudgetListProps) => {
  if (isLoading || !rows)
    return <Skeleton className="h-[340px] rounded-card" />;

  const budgets = [...rows]
    .filter((r) => r.valorOrcado > 0)
    .sort((a, b) => b.percentualUtilizado - a.percentualUtilizado)
    .slice(0, 6);

  return (
    <div className={panel()}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-display text-[17px] font-bold text-fg">
          Orçamento por categoria
        </h2>
        <span className="text-[12.5px] text-muted">teto mensal</span>
      </div>

      {budgets.length === 0 && (
        <p className="py-8 text-center text-sm text-muted">
          Nenhuma categoria com teto definido.
        </p>
      )}

      <div className="flex flex-col gap-[18px]">
        {budgets.map((b) => {
          const over = b.valorRealizado > b.valorOrcado;
          const pctW = Math.min(100, b.percentualUtilizado);
          return (
            <div key={b.categoriaId} className="animate-om-rise">
              <div className="mb-[6px] flex items-center gap-2">
                <span
                  className="size-[11px] rounded-full"
                  style={{ backgroundColor: enhance(b.categoriaCor) }}
                />
                <span className="text-sm font-semibold text-fg">
                  {b.categoriaNome}
                </span>
                <span className="ml-auto text-[12.5px] text-muted">
                  {formatCurrency(b.valorRealizado)} /{" "}
                  {formatCurrency(b.valorOrcado)}
                </span>
              </div>
              <div className="h-[9px] overflow-hidden rounded-pill bg-track">
                <div
                  className="h-full rounded-pill transition-[width]"
                  style={{
                    width: `${pctW}%`,
                    backgroundColor: over ? "#E5484D" : enhance(b.categoriaCor),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
