import { useState } from "react";

import type { DiaCalendario } from "@/domain/models";
import { MonthPicker } from "@/presentation/components";
import { Skeleton } from "@/presentation/components/ui";
import { useGetCalendario } from "@/presentation/hooks/api";

import { buildGrid, buildKpis, buildWeekSummaries } from "./calendar.helpers";
import { segButton } from "./calendar.styles";
import {
  CalendarKpis,
  ContasAPagarTab,
  DayTransactionsDialog,
  MonthCalendarGrid,
  WeekSummary,
} from "./components";

const now = new Date();

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

/**
 * Tela de Calendário (nova identidade). Card único com KPIs do mês, grade
 * mensal (heatmap de gasto + entradas por dia) e resumo por semana. Clicar num
 * dia abre o modal com as transações. Aba "Contas a pagar" = placeholder
 * (recorrências, Etapa 3).
 */
const Calendar = () => {
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [ano, setAno] = useState(now.getFullYear());
  const [tab, setTab] = useState<"lancamentos" | "contas">("lancamentos");
  const [dayModal, setDayModal] = useState<{
    open: boolean;
    dia: DiaCalendario | null;
  }>({ open: false, dia: null });

  const { data, isLoading } = useGetCalendario({ ano, mes });
  const dias = data?.data?.diasDoMes ?? [];

  const kpis = buildKpis(dias);
  const cells = buildGrid(dias, ano, mes);
  const weeks = buildWeekSummaries(cells);

  return (
    <div className="animate-om-fade pb-8">
      <h1 className="mb-5 font-display text-[30px] font-bold -tracking-[0.025em] text-fg">
        Calendário
      </h1>

      {/* Sub-tabs */}
      <div className="mb-4 inline-flex max-w-[360px] gap-1 rounded-[13px] bg-track p-1">
        <button
          type="button"
          onClick={() => setTab("lancamentos")}
          className={segButton({ active: tab === "lancamentos" })}
        >
          Lançamentos
        </button>
        <button
          type="button"
          onClick={() => setTab("contas")}
          className={segButton({ active: tab === "contas" })}
        >
          Contas a pagar
        </button>
      </div>

      {tab === "lancamentos" ? (
        <div className="flex flex-col gap-4">
          <CalendarKpis kpis={kpis} isLoading={isLoading} />

          {/* Card do calendário */}
          <div className="rounded-card border border-line bg-card p-[22px] sm:px-6">
            {/* Header: mês + legenda + navegação */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-[19px] font-semibold text-fg">
                {MESES[mes - 1]} {ano}
              </h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-[6px] text-[12px] text-muted">
                  <span
                    className="size-[10px] rounded-[3px]"
                    style={{ backgroundColor: "rgba(229,72,77,.28)" }}
                  />
                  gasto no dia
                </span>
                <MonthPicker
                  month={mes}
                  year={ano}
                  onChange={(m, y) => {
                    setMes(m);
                    setAno(y);
                  }}
                />
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="h-[520px] rounded-xl" />
            ) : (
              <>
                <MonthCalendarGrid
                  dias={dias}
                  ano={ano}
                  mes={mes}
                  onDayClick={(dia) => setDayModal({ open: true, dia })}
                />
                <WeekSummary weeks={weeks} />
              </>
            )}
          </div>
        </div>
      ) : (
        <ContasAPagarTab
          ano={ano}
          mes={mes}
          onMonthChange={(m, y) => {
            setMes(m);
            setAno(y);
          }}
        />
      )}

      <DayTransactionsDialog
        dia={dayModal.dia}
        open={dayModal.open}
        onOpenChange={(open) => setDayModal((d) => ({ ...d, open }))}
      />
    </div>
  );
};

export default Calendar;
