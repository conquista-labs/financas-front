import { useState } from "react";

import type { DespesaPorCategoriaMes, SaldosPorMes } from "@/domain/models";
import { cn } from "@/lib/utils";

import { panel } from "../../home.styles";
import { CategoryMatrix } from "../CategoryMatrix";
import { IncomeExpenseChart } from "../IncomeExpenseChart";
import { YearTable } from "../YearTable";

type Aba = "tabela" | "grafico" | "categoria";

const ABAS: { id: Aba; label: string }[] = [
  { id: "tabela", label: "Tabela" },
  { id: "grafico", label: "Gráfico" },
  { id: "categoria", label: "Por categoria" },
];

interface AnoMesAMesProps {
  saldosMes: SaldosPorMes[];
  porCategoria: DespesaPorCategoriaMes[];
  mes: number;
  onSelectMonth: (mes: number) => void;
  isLoading?: boolean;
}

/**
 * "O ano, mês a mês": tabela do ano (clicar num mês troca o período da
 * página), gráfico de entradas e saídas e a matriz de despesas por categoria.
 */
export const AnoMesAMes = ({
  saldosMes,
  porCategoria,
  mes,
  onSelectMonth,
  isLoading,
}: AnoMesAMesProps) => {
  const [aba, setAba] = useState<Aba>("tabela");

  return (
    <section aria-labelledby="ano-titulo" className={panel()}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="ano-titulo" className="font-display text-xl font-bold">
            O ano, mês a mês
          </h2>
          <p className="mt-[2px] text-[13px] text-fg2">
            Quanto entrou, quanto saiu, quanto sobrou e como o saldo foi
            crescendo.
          </p>
        </div>
        <div role="tablist" className="flex gap-1 rounded-full bg-track p-1">
          {ABAS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={aba === a.id}
              onClick={() => setAba(a.id)}
              className={cn(
                "h-8 rounded-full px-[14px] text-[13px] font-semibold transition-colors",
                aba === a.id
                  ? "bg-card text-fg shadow-[0_1px_3px_rgba(0,0,0,.08)]"
                  : "text-fg2 hover:text-fg",
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {aba === "tabela" && (
        <>
          <YearTable
            bare
            rows={saldosMes}
            currentMonth={mes}
            isLoading={isLoading}
            onSelectMonth={onSelectMonth}
          />
          <p className="mt-3 text-[12px] text-fg2">
            Barra de cor na esquerda = % gasto (verde até 95%, âmbar até 100%,
            vermelho acima). Clique num mês para trocar o período de toda a
            página.
          </p>
        </>
      )}
      {aba === "grafico" && (
        <IncomeExpenseChart bare rows={saldosMes} isLoading={isLoading} />
      )}
      {aba === "categoria" && (
        <CategoryMatrix bare data={porCategoria} isLoading={isLoading} />
      )}
    </section>
  );
};
