import { TrendingDown, TrendingUp } from "lucide-react";

import type { CategoriaAnalyticsDto } from "@/domain/models";
import { enhance } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import { panel } from "../../home.styles";

interface TopCategoriasCardProps {
  rows?: CategoriaAnalyticsDto[];
  isLoading?: boolean;
}

/** Cor do "Teto X%": >100 vermelho, ≥80 âmbar, senão verde. */
const tetoColor = (pct: number) => {
  if (pct > 100) return "text-danger";
  if (pct >= 80) return "text-warning";
  return "text-success";
};

/**
 * "Top categorias do mês" — despesas por categoria ordenadas por valor, com
 * variação vs. mês anterior e rótulo de teto (quando definido).
 */
export const TopCategoriasCard = ({
  rows,
  isLoading,
}: TopCategoriasCardProps) => {
  if (isLoading || !rows)
    return <Skeleton className="h-[360px] rounded-card" />;

  const top = [...rows]
    .filter((c) => c.tipo === "despesa" && c.valorTotal > 0)
    .sort((a, b) => b.valorTotal - a.valorTotal)
    .slice(0, 6);

  return (
    <div className={panel()}>
      <h2 className="font-display text-[17px] font-bold text-fg">
        Top categorias do mês
      </h2>
      <p className="mb-4 text-[12.5px] text-muted">com alerta de teto</p>

      {top.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          Sem despesas neste mês.
        </p>
      ) : (
        <div>
          {top.map((c) => {
            const temTeto = c.tetoGasto > 0;
            const variacao = c.mesAnterior?.variacao ?? 0;
            const subiu = variacao > 0;
            return (
              <div
                key={c.id}
                className="flex items-center gap-3 border-b border-line2 py-[13px] last:border-0"
              >
                <span
                  className="size-[11px] shrink-0 rounded-full"
                  style={{ backgroundColor: enhance(c.cor) }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-fg">
                    {c.nome}
                  </p>
                  <p className="flex items-center gap-1 text-[12px] text-muted">
                    {Math.round(c.percentualDoTotal)}% do total
                    {variacao !== 0 && (
                      <span
                        className={cn(
                          "ml-1 flex items-center gap-[2px] font-semibold",
                          subiu ? "text-danger" : "text-success",
                        )}
                      >
                        {subiu ? (
                          <TrendingUp className="size-3" />
                        ) : (
                          <TrendingDown className="size-3" />
                        )}
                        {Math.abs(variacao).toFixed(0)}%
                      </span>
                    )}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-sm font-semibold text-fg">
                    {formatCurrency(c.valorTotal)}
                  </p>
                  <p
                    className={cn(
                      "text-[12px] font-semibold",
                      temTeto ? tetoColor(c.percentualTeto) : "text-muted",
                    )}
                  >
                    {temTeto
                      ? `Teto ${Math.round(c.percentualTeto)}%`
                      : "sem teto"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
