import type { SaldosPorMes } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import { panel, spentChip } from "../../home.styles";

interface YearTableProps {
  rows?: SaldosPorMes[];
  currentMonth: number; // 1-12
  isLoading?: boolean;
}

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const COLS = "grid-cols-[1.1fr_1fr_1fr_.8fr_1.1fr_1fr_1fr] min-w-[680px]";

type Level = "ok" | "warn" | "over";

const chipLevel = (pct?: number): Level => {
  if (pct == null) return "ok";
  if (pct > 100) return "over";
  if (pct >= 95) return "warn";
  return "ok";
};

/** Cor do accent (barra lateral) = cor do chip de %. */
const ACCENT: Record<Level, string> = {
  ok: "#12A66A",
  warn: "#B76E00",
  over: "#E5484D",
};

const signColor = (v?: number) =>
  v == null || v === 0 ? "text-fg" : v > 0 ? "text-success" : "text-danger";

/** Valor com sinal explícito ("+ R$ …" / "- R$ …"), como no protótipo. */
const signedCurrency = (v?: number) => {
  if (v == null || v === 0) return formatCurrency(v);
  const sign = v > 0 ? "+ " : "- ";
  return sign + formatCurrency(Math.abs(v));
};

/** "Resumo do ano" — tabela CSS grid com 12 meses + rodapé de totais. */
export const YearTable = ({
  rows,
  currentMonth,
  isLoading,
}: YearTableProps) => {
  if (isLoading || !rows)
    return <Skeleton className="h-[420px] rounded-card" />;

  const totalDesp = rows.reduce((s, r) => s + (r.despesa ?? 0), 0);
  const totalRec = rows.reduce((s, r) => s + (r.receita ?? 0), 0);

  return (
    <div className={panel()}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-[17px] font-bold text-fg">
          Resumo do ano — receitas e despesas
        </h2>
        <span className="text-[12.5px] text-muted">
          saldo acumulado mês a mês
        </span>
      </div>
      <div className="overflow-x-auto">
        <div className={cn("grid", COLS)}>
          {/* header */}
          {[
            "Mês",
            "Despesas",
            "Receitas",
            "% Gasto",
            "Saldo ant.",
            "Saldo",
            "Δ mês",
          ].map((h, i) => (
            <div
              key={h}
              className={cn(
                "border-b border-line pb-[10px] text-[12px] font-semibold text-muted",
                i === 0 ? "pl-[10px] text-left" : "text-right",
              )}
            >
              {h}
            </div>
          ))}

          {/* rows */}
          {rows.map((r, i) => {
            const mesNum = i + 1;
            const atual = mesNum === currentMonth;
            const level = chipLevel(r.percentualGasto);
            return (
              <div key={r.mes ?? i} className="contents">
                <div
                  className={cn(
                    "border-b border-line2 py-[11px] pl-[10px] text-sm font-semibold text-fg",
                    atual && "bg-primary-soft/50",
                  )}
                  style={{ borderLeft: `3px solid ${ACCENT[level]}` }}
                >
                  {MESES[i]}
                </div>
                <Cell atual={atual} className="text-danger">
                  {formatCurrency(r.despesa)}
                </Cell>
                <Cell atual={atual} className="text-success">
                  {formatCurrency(r.receita)}
                </Cell>
                <Cell atual={atual}>
                  {r.percentualGasto != null ? (
                    <span className={spentChip({ level })}>
                      {Math.round(r.percentualGasto)}%
                    </span>
                  ) : (
                    "—"
                  )}
                </Cell>
                <Cell atual={atual} className="text-muted">
                  {formatCurrency(r.saldoMesAnterior)}
                </Cell>
                <Cell
                  atual={atual}
                  className={cn(
                    "font-display font-semibold",
                    signColor(r.valor),
                  )}
                >
                  {formatCurrency(r.valor)}
                </Cell>
                <Cell atual={atual} className={signColor(r.deltaMesAnterior)}>
                  {signedCurrency(r.deltaMesAnterior)}
                </Cell>
              </div>
            );
          })}
        </div>

        {/* footer — bloco próprio (fundo card2 contínuo, arredondado embaixo) */}
        <div
          className={cn(
            "mt-[2px] grid items-center rounded-b-[12px] bg-card2 py-[13px] text-sm font-bold",
            COLS,
          )}
        >
          <span className="pl-[10px] text-fg">Ano</span>
          <span className="pr-1 text-right text-danger">
            {formatCurrency(totalDesp)}
          </span>
          <span className="pr-1 text-right text-success">
            {formatCurrency(totalRec)}
          </span>
        </div>
      </div>
    </div>
  );
};

const Cell = ({
  children,
  className,
  atual,
}: {
  children: React.ReactNode;
  className?: string;
  atual?: boolean;
}) => (
  <div
    className={cn(
      "border-b border-line2 py-[11px] pr-1 text-right text-sm text-fg",
      atual && "bg-primary-soft/50",
      className,
    )}
  >
    {children}
  </div>
);
