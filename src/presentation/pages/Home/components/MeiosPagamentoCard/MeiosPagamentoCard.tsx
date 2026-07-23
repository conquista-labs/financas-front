import type { MeioPagamentoAnalyticsDto } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

import { panel } from "../../home.styles";

interface MeiosPagamentoCardProps {
  rows?: MeioPagamentoAnalyticsDto[];
  isLoading?: boolean;
}

/**
 * "Meios de pagamento" — participação de cada meio no total do mês, em barras
 * de progresso (todas roxas, fiel ao protótipo).
 */
export const MeiosPagamentoCard = ({
  rows,
  isLoading,
}: MeiosPagamentoCardProps) => {
  if (isLoading || !rows)
    return <Skeleton className="h-[300px] rounded-card" />;

  const meios = [...rows]
    .filter((m) => m.valorTotal > 0)
    .sort((a, b) => b.valorTotal - a.valorTotal)
    .slice(0, 6);

  return (
    <div className={panel()}>
      <h2 className="mb-4 font-display text-[17px] font-bold text-fg">
        Meios de pagamento
      </h2>

      {meios.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          Sem movimentações neste mês.
        </p>
      ) : (
        <div className="flex flex-col gap-[16px]">
          {meios.map((m) => (
            <div key={m.id}>
              <div className="mb-[6px] flex items-center gap-2">
                <span className="text-sm font-semibold text-fg">{m.nome}</span>
                <span className="ml-auto text-[12.5px] text-muted">
                  {formatCurrency(m.valorTotal)} ·{" "}
                  {Math.round(m.percentualDoTotal)}%
                </span>
              </div>
              <div className="h-[9px] overflow-hidden rounded-pill bg-track">
                <div
                  className="h-full rounded-pill bg-primary transition-[width]"
                  style={{ width: `${Math.min(100, m.percentualDoTotal)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
