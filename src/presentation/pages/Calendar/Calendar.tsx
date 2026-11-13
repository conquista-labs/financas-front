import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { MonthPicker } from "@/presentation/components";
import { useQuickAdd } from "@/presentation/components/QuickAdd";
import { Skeleton } from "@/presentation/components/ui";
import { useGetTransacoes } from "@/presentation/hooks/api";

import {
  aPagarNoMes,
  contasPagas,
  diasComConta,
  diasDoMes,
  type TransacaoDoMes,
} from "./agenda.helpers";
import { buildGrid, buildKpis, buildWeekSummaries } from "./calendar.helpers";
import {
  CalendarKpis,
  ContasCard,
  DiaDetalhe,
  MonthCalendarGrid,
  WeekSummary,
} from "./components";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Agenda do "Repaginado": Calendário + Contas a pagar numa tela. KPIs do mês,
 * grade com mapa de calor do gasto e bolinha nos dias com conta, o dia
 * escolhido logo abaixo; à direita as contas (em atraso, próximos 15 dias,
 * pagas) e o resumo por semana.
 */
const Calendar = () => {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [diaEscolhido, setDiaEscolhido] = useState<number>(hoje.getDate());
  const { openQuickAddCom } = useQuickAdd();

  // Todas as transações do mês (o /transacoes/calendario só traz as com
  // "lembrar-me" e deixaria os totais incompletos).
  const { data, isLoading } = useGetTransacoes({
    page: 1,
    limit: 1000,
    startDate: `${ano}-${pad(mes)}-01`,
    endDate: `${ano}-${pad(mes)}-${pad(new Date(ano, mes, 0).getDate())}`,
  });
  const transacoes = useMemo(
    () => (data?.data?.rows ?? []) as unknown as TransacaoDoMes[],
    [data],
  );

  const dias = useMemo(
    () => diasDoMes(transacoes, ano, mes),
    [transacoes, ano, mes],
  );
  const kpis = buildKpis(dias);
  const semanas = buildWeekSummaries(buildGrid(dias, ano, mes));
  const comConta = useMemo(() => diasComConta(transacoes), [transacoes]);
  const dia = dias.find((d) => d.dia === diaEscolhido) ?? dias[0];

  const trocarMes = (m: number, a: number) => {
    setMes(m);
    setAno(a);
    // No mês atual abre hoje; nos outros, o dia 1.
    const atual = m === hoje.getMonth() + 1 && a === hoje.getFullYear();
    setDiaEscolhido(atual ? hoje.getDate() : 1);
  };

  return (
    <div className="flex animate-om-fade flex-col gap-4 pb-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[26px] font-bold -tracking-[0.03em] text-fg sm:text-[30px]">
          Agenda
        </h1>
        <div className="flex items-center gap-2">
          <MonthPicker month={mes} year={ano} onChange={trocarMes} />
          <button
            type="button"
            onClick={() => openQuickAddCom({ status: "pendente" })}
            className="flex h-[42px] items-center gap-[6px] whitespace-nowrap rounded-full bg-primary px-3 text-sm font-bold text-white shadow-primary transition-colors hover:bg-primary-strong sm:px-[18px]"
          >
            <Plus className="size-4" strokeWidth={2.6} />
            <span className="sm:hidden">Conta</span>
            <span className="hidden sm:inline">Nova conta</span>
          </button>
        </div>
      </header>

      <CalendarKpis
        kpis={kpis}
        aPagar={aPagarNoMes(transacoes)}
        isLoading={isLoading}
      />

      <div className="flex flex-wrap items-start gap-4">
        <section className="min-w-0 flex-[1.6_1_520px] rounded-[22px] border border-line bg-card p-5">
          {isLoading ? (
            <Skeleton className="h-[460px] rounded-[14px]" />
          ) : (
            <>
              <MonthCalendarGrid
                dias={dias}
                ano={ano}
                mes={mes}
                diaSelecionado={dia?.dia}
                diasComConta={comConta}
                onDayClick={(d) => setDiaEscolhido(d.dia)}
              />
              {dia && <DiaDetalhe dia={dia} ano={ano} mes={mes} />}
            </>
          )}
        </section>

        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
          <ContasCard pagasDoMes={contasPagas(transacoes)} />
          <WeekSummary weeks={semanas} />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
