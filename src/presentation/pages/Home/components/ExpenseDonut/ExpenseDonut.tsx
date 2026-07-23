import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { enhance } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

import { panel } from "../../home.styles";

export interface DonutCategoria {
  categoria: string;
  valor: number;
  cor: string;
}

interface ExpenseDonutProps {
  categorias?: DonutCategoria[];
  isLoading?: boolean;
}

/**
 * Donut "Para onde foi" — despesas por categoria do mês (Recharts Pie com
 * innerRadius). Buraco central mostra o total; legenda lista as 5 maiores com
 * o % de participação. Cores via enhance().
 */
export const ExpenseDonut = ({ categorias, isLoading }: ExpenseDonutProps) => {
  if (isLoading || !categorias)
    return <Skeleton className="h-[340px] rounded-card" />;

  const sorted = [...categorias]
    .filter((c) => c.valor > 0)
    .sort((a, b) => b.valor - a.valor);
  const total = sorted.reduce((s, c) => s + c.valor, 0);
  const top5 = sorted.slice(0, 5);

  return (
    <div className={panel()}>
      <h2 className="mb-4 font-display text-[17px] font-bold text-fg">
        Para onde foi
      </h2>

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          Sem despesas neste mês.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-5">
          {/* Donut */}
          <div className="relative size-[196px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sorted}
                  dataKey="valor"
                  nameKey="categoria"
                  innerRadius={62}
                  outerRadius={96}
                  paddingAngle={1}
                  stroke="none"
                >
                  {sorted.map((c) => (
                    <Cell key={c.categoria} fill={enhance(c.cor)} />
                  ))}
                </Pie>
                <Tooltip
                  content={<DonutTooltip total={total} />}
                  // Fixa o tooltip acima do donut para não cobrir o total
                  // central; allowEscapeViewBox deixa ele sair da área do chart.
                  position={{ y: -8 }}
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{ pointerEvents: "none" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] text-muted">total</span>
              <span className="font-display text-[16px] font-bold text-fg">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Legenda top 5 (abaixo do donut, largura total) */}
          <ul className="w-full space-y-[10px]">
            {top5.map((c) => (
              <li key={c.categoria} className="flex items-center gap-2 text-sm">
                <span
                  className="size-[9px] shrink-0 rounded-full"
                  style={{ backgroundColor: enhance(c.cor) }}
                />
                <span className="truncate text-fg2">{c.categoria}</span>
                <span className="ml-auto font-semibold text-muted">
                  {Math.round((c.valor / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface DonutTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  total: number;
}

const DonutTooltip = ({ active, payload, total }: DonutTooltipProps) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const valor = item.value as number;
  return (
    <div className="rounded-[10px] border border-line bg-card px-3 py-2 text-xs shadow-modal">
      <p className="font-semibold text-fg">{item.name}</p>
      <p className="text-fg2">
        {formatCurrency(valor)} · {Math.round((valor / total) * 100)}%
      </p>
    </div>
  );
};
