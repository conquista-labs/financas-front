import type { DespesaPorCategoriaMes } from "@/domain/models";
import { enhance } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import { panel } from "../../home.styles";

interface CategoryMatrixProps {
  /** Um item por mês, cada um com suas categorias de despesa. */
  data?: DespesaPorCategoriaMes[];
  isLoading?: boolean;
}

const MESES_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

interface Row {
  nome: string;
  cor: string;
  valores: number[]; // 12 posições
  teto: number; // teto mensal da categoria (0 = sem teto)
  total: number;
}

/** Pivota despesasPorCategoriaMes → linhas (categoria) × 12 meses. */
const buildMatrix = (data: DespesaPorCategoriaMes[]): Row[] => {
  const map = new Map<string, Row>();
  data.forEach((mesItem, mesIdx) => {
    (mesItem.categorias ?? []).forEach((c) => {
      let row = map.get(c.categoria);
      if (!row) {
        row = {
          nome: c.categoria,
          cor: c.cor,
          valores: Array(12).fill(0),
          teto: c.tetoGasto ?? 0,
          total: 0,
        };
        map.set(c.categoria, row);
      }
      row.valores[mesIdx] = c.valor;
      // mantém o maior teto informado (algumas categorias variam por mês)
      if ((c.tetoGasto ?? 0) > row.teto) row.teto = c.tetoGasto ?? 0;
      row.total += c.valor;
    });
  });
  return [...map.values()].sort((a, b) => b.total - a.total);
};

/** Formata compacto com R$ (ex.: R$ 1,2k / R$ 850). "–" quando zero. */
const short = (v: number) => {
  if (v === 0) return "–";
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(1).replace(".", ",")}k`;
  return `R$ ${Math.round(v)}`;
};

/**
 * Matriz "Despesas por categoria — mês a mês". Grid com primeira coluna sticky
 * (nome da categoria) + 12 meses + total. Scroll horizontal em telas estreitas.
 */
export const CategoryMatrix = ({ data, isLoading }: CategoryMatrixProps) => {
  if (isLoading || !data)
    return <Skeleton className="h-[360px] rounded-card" />;

  const rows = buildMatrix(data);
  const COLS = "grid-cols-[150px_repeat(12,minmax(56px,1fr))_92px]";

  return (
    <div className={panel()}>
      <h2 className="font-display text-[17px] font-bold text-fg">
        Despesas por categoria — mês a mês
      </h2>
      <p className="mb-4 text-[12.5px] text-muted">
        valores acima do teto em vermelho
      </p>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          Sem despesas no período.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className={cn("grid min-w-[840px]", COLS)}>
            {/* header */}
            <div className="sticky left-0 z-10 border-b border-line bg-card pb-2 text-[11.5px] font-semibold text-muted">
              Categoria
            </div>
            {MESES_SHORT.map((m) => (
              <div
                key={m}
                className="border-b border-line pb-2 text-center text-[11.5px] font-semibold text-muted"
              >
                {m}
              </div>
            ))}
            <div className="border-b border-line pb-2 pl-[14px] text-right text-[11.5px] font-semibold text-muted">
              Ano
            </div>

            {/* rows */}
            {rows.map((row) => (
              <div key={row.nome} className="contents">
                <div className="sticky left-0 z-10 flex items-center gap-[7px] border-b border-line2 bg-card py-[9px] text-[13px] font-semibold text-fg">
                  <span
                    className="size-[9px] shrink-0 rounded-full"
                    style={{ backgroundColor: enhance(row.cor) }}
                  />
                  <span className="truncate">{row.nome}</span>
                </div>
                {row.valores.map((v, i) => {
                  const acimaTeto = row.teto > 0 && v > row.teto;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "border-b border-line2 py-[9px] text-center text-[12px]",
                        acimaTeto ? "font-semibold text-danger" : "text-fg2",
                      )}
                      title={v > 0 ? formatCurrency(v) : undefined}
                    >
                      {short(v)}
                    </div>
                  );
                })}
                <div className="border-b border-line2 py-[9px] pl-[14px] text-right text-[12.5px] font-semibold text-fg">
                  {formatCurrency(row.total)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
