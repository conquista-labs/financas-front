import type { DistribuicaoItem } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

import { categoriaColor } from "../patrimony.helpers";

interface ComposicaoAtivosProps {
  itens: DistribuicaoItem[];
  isLoading?: boolean;
}

/**
 * "Composição dos ativos" — barras de progresso horizontais, uma por categoria,
 * ordenadas por valor (o backend já manda ordenado). Cor por categoria; o
 * `percentual` já vem em 0–100.
 */
export const ComposicaoAtivos = ({
  itens,
  isLoading,
}: ComposicaoAtivosProps) => (
  <div className="rounded-[20px] border border-line bg-card p-5">
    <h3 className="font-display text-[17px] font-semibold text-fg">
      Composição dos ativos
    </h3>

    {isLoading ? (
      <div className="mt-4 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 rounded-lg" />
        ))}
      </div>
    ) : itens.length === 0 ? (
      <p className="mt-6 text-center text-sm text-muted">
        Nenhum ativo cadastrado.
      </p>
    ) : (
      <div className="mt-4 flex flex-col gap-[15px]">
        {itens.map((item) => {
          const cor = categoriaColor(item.categoria);
          const pct = Math.max(0, Math.min(100, item.percentual));
          return (
            <div key={item.categoria}>
              <div className="mb-[6px] flex items-center justify-between text-[13.5px]">
                <span className="font-semibold text-fg">
                  {item.categoriaFormatada}
                </span>
                <span className="text-fg2">
                  {formatCurrency(item.valor)} · {pct.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-track">
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{ width: `${pct}%`, backgroundColor: cor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
