import { RefreshCw } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { MonthPicker } from "@/presentation/components";
import {
  useGetAnalyticsCategorias,
  useGetAnalyticsMeiosPagamento,
  useGetAnalyticsOrcamento,
  useGetQuickStats,
  useGetResumoFinanceiro,
  useGetTransacoes,
} from "@/presentation/hooks/api";
import { useAuthStore } from "@/presentation/store";

import {
  BalanceHero,
  BudgetList,
  CategoryMatrix,
  ExpenseDonut,
  HealthCard,
  IncomeExpenseChart,
  KpiCards,
  MeiosPagamentoCard,
  RecentTransactions,
  TopCategoriasCard,
  YearTable,
} from "./components";
import { monthNavButton, segButton } from "./home.styles";

const now = new Date();

/**
 * Dashboard "Visão geral" (nova identidade Nossa Grana). KPIs + hero de saldo +
 * resumo do ano + gráficos (bar/donut via Recharts) + orçamentos + últimos
 * lançamentos. Aba "Análises" fica para a próxima entrega.
 */
const Home = () => {
  const { auth } = useAuthStore();
  const [ano, setAno] = useState(now.getFullYear());
  const [mes, setMes] = useState(now.getMonth() + 1); // 1-12
  const [tab, setTab] = useState<"geral" | "analises">("geral");

  const {
    data: resumo,
    isLoading: loadingResumo,
    refetch: refetchResumo,
  } = useGetResumoFinanceiro({ ano });
  const {
    data: quickStats,
    isLoading: loadingStats,
    refetch: refetchStats,
  } = useGetQuickStats({ ano, mes });
  const {
    data: orcamento,
    isLoading: loadingOrc,
    refetch: refetchOrc,
  } = useGetAnalyticsOrcamento({ ano, mes });
  const {
    data: transacoes,
    isLoading: loadingTx,
    refetch: refetchTx,
  } = useGetTransacoes({ page: 1, limit: 6 });

  // Aba Análises (categorias e meios do mês).
  const {
    data: categorias,
    isLoading: loadingCat,
    refetch: refetchCat,
  } = useGetAnalyticsCategorias({ ano, mes });
  const {
    data: meios,
    isLoading: loadingMeios,
    refetch: refetchMeios,
  } = useGetAnalyticsMeiosPagamento({ ano, mes });

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchResumo(),
      refetchStats(),
      refetchOrc(),
      refetchTx(),
      refetchCat(),
      refetchMeios(),
    ]);
    setRefreshing(false);
  };

  const resumoData = resumo?.data;
  const saldosMes = resumoData?.saldosMes ?? [];
  const mesAtual = saldosMes[mes - 1];
  const donutCategorias =
    resumoData?.despesasPorCategoriaMes?.[mes - 1]?.categorias ?? [];
  const matrizData = resumoData?.despesasPorCategoriaMes ?? [];

  const stats = quickStats?.data;
  const orcamentoRows = orcamento?.data?.orcamentoCategorias ?? [];
  const saude = orcamento?.data?.saudeFinanceira;
  const categoriasRows = categorias?.data?.categorias ?? [];
  const meiosRows = meios?.data?.meiosPagamento ?? [];
  const primeiroNome = (auth.user?.nome ?? "").split(" ")[0];

  return (
    <div className="animate-om-fade pb-8">
      {/* Header + seletor de mês */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Olá, {primeiroNome} 👋</p>
          <h1 className="font-display text-[30px] font-bold -tracking-[0.025em] text-fg">
            Visão geral
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Atualizar dados"
            title="Atualizar dados"
            onClick={handleRefresh}
            disabled={refreshing}
            className={cn(monthNavButton(), "disabled:opacity-60")}
          >
            <RefreshCw
              className={cn("size-[17px]", refreshing && "animate-spin")}
            />
          </button>
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

      {/* Tabs segmentadas */}
      <div className="mb-5 inline-flex max-w-[320px] gap-1 rounded-[13px] bg-track p-1">
        <button
          type="button"
          onClick={() => setTab("geral")}
          className={segButton({ active: tab === "geral" })}
        >
          Visão geral
        </button>
        <button
          type="button"
          onClick={() => setTab("analises")}
          className={segButton({ active: tab === "analises" })}
        >
          Análises
        </button>
      </div>

      {tab === "geral" ? (
        <div className="flex flex-col gap-4">
          <KpiCards
            gastoSemana={stats?.gastoSemana}
            economiaMes={stats?.economiaMes}
            maiorCategoria={stats?.maiorCategoria}
            transacaoMaior={stats?.transacaoMaior}
            isLoading={loadingStats}
          />
          <BalanceHero
            saldo={mesAtual?.valor}
            receitas={mesAtual?.receita}
            despesas={mesAtual?.despesa}
            isLoading={loadingResumo}
          />
          <YearTable
            rows={saldosMes}
            currentMonth={mes}
            isLoading={loadingResumo}
          />
          <IncomeExpenseChart rows={saldosMes} isLoading={loadingResumo} />
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <BudgetList rows={orcamentoRows} isLoading={loadingOrc} />
            <ExpenseDonut
              categorias={donutCategorias}
              isLoading={loadingResumo}
            />
          </div>
          <RecentTransactions
            rows={transacoes?.data?.rows}
            isLoading={loadingTx}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <TopCategoriasCard rows={categoriasRows} isLoading={loadingCat} />
            <HealthCard saude={saude} isLoading={loadingOrc} />
          </div>
          <MeiosPagamentoCard rows={meiosRows} isLoading={loadingMeios} />
          <CategoryMatrix data={matrizData} isLoading={loadingResumo} />
        </div>
      )}
    </div>
  );
};

export default Home;
