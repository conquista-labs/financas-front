import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

interface TotaisPeriodoProps {
  entradas: number;
  saidas: number;
  quantidade: number;
  isLoading?: boolean;
}

/** Entradas, Saídas e o Total do período (entradas − saídas), com os filtros. */
export const TotaisPeriodo = ({
  entradas,
  saidas,
  quantidade,
  isLoading,
}: TotaisPeriodoProps) => {
  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[66px] rounded-[16px]" />
        ))}
      </div>
    );
  const total = entradas - saidas;
  const n = `${quantidade} ${quantidade === 1 ? "lançamento" : "lançamentos"}`;
  return (
    <>
      {/* Celular: uma linha só (como no protótipo mobile). */}
      <div className="flex items-baseline justify-between gap-3 px-1 sm:hidden">
        <span className="text-[13px] text-fg2">{n}</span>
        <strong
          className={cn(
            "shrink-0 font-display text-base tabular-nums",
            total >= 0 ? "text-success" : "text-danger",
          )}
        >
          {total >= 0 ? "+ " : "- "}
          {formatCurrency(Math.abs(total))}
        </strong>
      </div>
      <div className="hidden gap-[10px] sm:grid sm:grid-cols-3">
        <div className="rounded-[16px] border border-line bg-card px-4 py-3">
          <p className="text-xs text-fg2">Entradas</p>
          <p className="mt-[2px] font-display text-[19px] font-bold tabular-nums text-success">
            + {formatCurrency(entradas)}
          </p>
        </div>
        <div className="rounded-[16px] border border-line bg-card px-4 py-3">
          <p className="text-xs text-fg2">Saídas</p>
          <p className="mt-[2px] font-display text-[19px] font-bold tabular-nums text-fg">
            - {formatCurrency(saidas)}
          </p>
        </div>
        <div className="rounded-[16px] bg-sidebar px-4 py-3 text-white">
          <p className="text-xs text-[#B9B5C6]">
            Total do período · {quantidade}{" "}
            {quantidade === 1 ? "lançamento" : "lançamentos"}
          </p>
          <p
            className={cn(
              "mt-[2px] font-display text-[19px] font-bold tabular-nums",
              total >= 0 ? "text-[#7FE0B0]" : "text-white",
            )}
          >
            {total >= 0 ? "+ " : "- "}
            {formatCurrency(Math.abs(total))}
          </p>
        </div>
      </div>
    </>
  );
};
