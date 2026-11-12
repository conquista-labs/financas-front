import { enhance } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

import { panel } from "../../home.styles";

export interface CategoriaGasto {
  categoria: string;
  valor: number;
  cor: string;
}

const MAX_FATIAS = 5;
const COR_OUTRAS = "#B4B0BE";

/** Top N categorias + "Outras" com o resto (para a barra não virar confete). */
export const fatiasDoMes = (categorias: CategoriaGasto[]) => {
  const ordenadas = [...categorias]
    .filter((c) => c.valor > 0)
    .sort((a, b) => b.valor - a.valor);
  const total = ordenadas.reduce((s, c) => s + c.valor, 0);
  const topo = ordenadas.slice(0, MAX_FATIAS);
  const resto = ordenadas.slice(MAX_FATIAS).reduce((s, c) => s + c.valor, 0);
  const fatias =
    resto > 0
      ? [...topo, { categoria: "Outras", valor: resto, cor: COR_OUTRAS }]
      : topo;
  return {
    total,
    fatias: fatias.map((f) => ({
      ...f,
      pct: total ? Math.round((f.valor / total) * 100) : 0,
    })),
  };
};

/** "Para onde foi": barra empilhada das despesas do mês por categoria. */
export const ParaOndeFoi = ({
  categorias,
  isLoading,
}: {
  categorias: CategoriaGasto[];
  isLoading?: boolean;
}) => {
  if (isLoading) return <Skeleton className="h-[220px] rounded-card" />;
  const { total, fatias } = fatiasDoMes(categorias);

  return (
    <section className={panel()}>
      <h2 className="mb-4 font-display text-lg font-bold">Para onde foi</h2>
      {!total ? (
        <p className="py-8 text-center text-[13px] text-muted">
          Nenhuma despesa neste mês.
        </p>
      ) : (
        <>
          <div
            className="flex h-4 gap-[3px] overflow-hidden rounded-full"
            role="img"
            aria-label={fatias
              .map((f) => `${f.categoria} ${f.pct}%`)
              .join(", ")}
          >
            {fatias.map((f) => (
              <span
                key={f.categoria}
                style={{
                  flexGrow: f.valor,
                  backgroundColor:
                    f.cor === COR_OUTRAS ? f.cor : enhance(f.cor),
                }}
                className="min-w-[4px] first:rounded-l-full last:rounded-r-full"
              />
            ))}
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-[10px] sm:grid-cols-2">
            {fatias.map((f) => (
              <li
                key={f.categoria}
                className="flex items-center gap-2 text-[13px]"
              >
                <span
                  className="size-[9px] shrink-0 rounded-[3px]"
                  style={{
                    backgroundColor:
                      f.cor === COR_OUTRAS ? f.cor : enhance(f.cor),
                  }}
                />
                <span className="min-w-0 flex-1 truncate">{f.categoria}</span>
                <span className="font-semibold tabular-nums">
                  {formatCurrency(f.valor)}
                </span>
                <span className="w-9 text-right text-fg2 tabular-nums">
                  {f.pct}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};
