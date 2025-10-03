import React, { useMemo, useState } from "react";
import { Box, Datepicker, IconButton, Title } from "@rarui-react/components";
import {
  useGetResumoFinanceiro,
  usePostResumoFinanceiro,
  useGetCalendario,
  useGetAnalyticsCategorias,
  useGetAnalyticsOrcamento,
  useGetAnalyticsMeiosPagamento,
  useGetQuickStats,
  useGetAnalyticsPadroesTemporais,
} from "@/presentation/hooks/api";

import { useAuthStore } from "@/presentation/store";
import {
  ResumoMensalTable,
  ResumoFinanceiroChart,
  ResumoPorCategoriaTable,
  Card,
  Header,
  TopCategoriasCard,
  SaudeFinanceiraCard,
  MeiosPagamentoChart,
  QuickStatCard,
  PadroesTemporaisCard,
} from "./components";
import { Loading, MiniCalendar } from "@/presentation/components";
import { ArrowLeftIcon, ArrowRightIcon } from "@rarui/icons";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { addYears, subYears, format, getMonth, getYear } from "date-fns";

const Home: React.FC = () => {
  const [year, setYear] = useQueryParam(
    "year",
    withDefault(StringParam, format(new Date(), "yyyy")),
  );

  const { auth } = useAuthStore();
  const {
    data,
    isLoading: loadingResumo,
    refetch,
  } = useGetResumoFinanceiro({ ano: Number(year) });
  const { mutate, isPending } = usePostResumoFinanceiro();

  // Estado para navegação do mini calendário
  const [miniCalendarMonth, setMiniCalendarMonth] = useState(
    getMonth(new Date()) + 1,
  );
  const [miniCalendarYear, setMiniCalendarYear] = useState(Number(year));

  const { data: calendarioData, isLoading: loadingCalendario } =
    useGetCalendario({
      ano: miniCalendarYear,
      mes: miniCalendarMonth,
    });

  // Analytics de Categorias
  const {
    data: analyticsCategoriasData,
    isLoading: loadingAnalyticsCategorias,
  } = useGetAnalyticsCategorias({
    ano: Number(year),
    mes: new Date().getMonth() + 1, // Mês atual
    limit: 5,
  });

  // Analytics de Orçamento
  const { data: analyticsOrcamentoData, isLoading: loadingAnalyticsOrcamento } =
    useGetAnalyticsOrcamento({
      ano: Number(year),
      mes: new Date().getMonth() + 1, // Mês atual
    });

  // Analytics de Meios de Pagamento
  const {
    data: analyticsMeiosPagamentoData,
    isLoading: loadingAnalyticsMeiosPagamento,
  } = useGetAnalyticsMeiosPagamento({
    ano: Number(year),
    mes: new Date().getMonth() + 1, // Mês atual
  });

  // Quick Stats
  const { data: quickStatsData, isLoading: loadingQuickStats } =
    useGetQuickStats({
      ano: Number(year),
      mes: new Date().getMonth() + 1, // Mês atual
    });

  // Analytics de Padrões Temporais
  const {
    data: analyticsPadroesTemporaisData,
    isLoading: loadingAnalyticsPadroesTemporais,
  } = useGetAnalyticsPadroesTemporais({
    ano: Number(year),
    mes: new Date().getMonth() + 1, // Mês atual
  });

  const isLoading = useMemo(
    () => loadingResumo || isPending,
    [loadingResumo, isPending],
  );

  const resumo = data?.data;
  const receitasMes = resumo?.receitasMes ?? [];
  const despesasMes = resumo?.despesasMes ?? [];
  const saldosMes = resumo?.saldosMes ?? [];
  const receitasAno = resumo?.receitasAno ?? 0;
  const despesasAno = resumo?.despesasAno ?? 0;
  const despesasPorCategoriaAno = resumo?.despesasPorCategoriaAno ?? [];
  const despesasPorCategoriaMes = resumo?.despesasPorCategoriaMes ?? [];
  const saldosMesAno = resumo?.saldosMesAno ?? 0;

  const handleAtualizar = () =>
    mutate({ year: Number(year) }, { onSuccess: () => refetch() });

  const navigateYear = (direction: "prev" | "next") => {
    const operator = direction === "next" ? addYears : subYears;
    const date = new Date(Number(year), 0);
    const newYear = format(operator(date!, 1), "yyyy");
    setYear(newYear);
  };

  const handleYearChange = (date: Date) => {
    setYear(format(date, "yyyy"));
    setMiniCalendarYear(getYear(date));
  };

  const handleMiniCalendarNavigate = (month: number, year: number) => {
    setMiniCalendarMonth(month);
    setMiniCalendarYear(year);
  };

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$s" pb="$xl">
      {/* 🎯 SEÇÃO 1: Header + Controles */}
      <Box display="flex" flexDirection="column" gap="$s">
        <Header
          nome={auth.nome}
          atualizadoEm={resumo?.atualizadoEm}
          onAtualizar={handleAtualizar}
        />

        <Box display="flex" justifyContent="flex-end">
          <Box
            display="flex"
            alignItems="center"
            gap="$2xs"
            width={{ xs: "100%", md: "300px" }}
          >
            <IconButton
              source={<ArrowLeftIcon size="medium" />}
              onClick={() => navigateYear("prev")}
            />
            <Datepicker
              dateFormat="yyyy"
              showYearPicker
              selected={new Date(Number(year), 0)}
              onChange={(date) => handleYearChange(date as Date)}
            />
            <IconButton
              source={<ArrowRightIcon size="medium" />}
              onClick={() => navigateYear("next")}
            />
          </Box>
        </Box>
      </Box>

      {/* 🎯 SEÇÃO 2: Quick Stats - Insights Rápidos */}
      <Box
        display="flex"
        flexDirection="column"
        gap="$s"
        padding="$s"
        borderRadius="$lg"
        backgroundColor="$background"
        borderWidth="$1"
        borderStyle="solid"
        borderColor="$secondary"
        position="relative"
        className="dashboard-section"
      >
        {/* Título da seção principal */}
        <Title as="h6" color="$secondary" textAlign="center">
          ⚡ Insights Financeiros {year}
        </Title>

        <Box
          display="flex"
          gap="$s"
          flexDirection={{ xs: "column", lg: "row" }}
        >
          {/* Grid dos Quick Stats - 2x3 em desktop, 1 coluna em mobile */}
          <Box
            display="grid"
            flex="1"
            gridTemplateColumns={{
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap="$s"
            order={{ xs: 2, lg: 1 }}
          >
            <QuickStatCard
              data={quickStatsData?.data?.gastoSemana}
              isLoading={loadingQuickStats}
            />
            <QuickStatCard
              data={quickStatsData?.data?.economiaMes}
              isLoading={loadingQuickStats}
            />
            <QuickStatCard
              data={quickStatsData?.data?.maiorCategoria}
              isLoading={loadingQuickStats}
            />
            <QuickStatCard
              data={quickStatsData?.data?.diasSemGastos}
              isLoading={loadingQuickStats}
            />
            <QuickStatCard
              data={quickStatsData?.data?.transacaoMaior}
              isLoading={loadingQuickStats}
            />
            <QuickStatCard
              data={quickStatsData?.data?.comparativoAno}
              isLoading={loadingQuickStats}
            />
          </Box>
          <Box order={{ xs: 1, lg: 2 }}>
            <MiniCalendar
              data={calendarioData?.data}
              currentMonth={miniCalendarMonth}
              currentYear={miniCalendarYear}
              onNavigateMonth={handleMiniCalendarNavigate}
              isLoading={loadingCalendario}
            />
          </Box>
        </Box>
      </Box>

      {/* 🎯 SEÇÃO 3: Visualizações Auxiliares - Gráfico + Calendário */}
      <Box
        display="grid"
        gridTemplateColumns={{
          md: "1fr",
          lg: "2fr 1fr",
          xl: "3fr 1fr",
        }}
        gap="$s"
        padding="$s"
        borderRadius="$lg"
        backgroundColor="$background"
        borderWidth="$1"
        borderStyle="solid"
        borderColor="$secondary"
      >
        <ResumoMensalTable
          receitasMes={receitasMes}
          despesasMes={despesasMes}
          receitasAno={receitasAno}
          despesasAno={despesasAno}
          saldosMes={saldosMes}
          saldosMesAno={saldosMesAno}
        />

        <TopCategoriasCard
          categorias={analyticsCategoriasData?.data?.categorias}
          totalGeral={analyticsCategoriasData?.data?.totalGeral}
          isLoading={loadingAnalyticsCategorias}
          title="🏆 Top Categorias do Mês"
        />
      </Box>

      {/* 🎯 SEÇÃO 4: Analytics e Insights */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          md: "1fr",
          lg: "1fr 1fr 1fr",
          xl: "2fr 1fr 1fr",
        }}
        gap="$s"
        padding="$s"
        borderRadius="$lg"
        backgroundColor="$background"
        borderWidth="$1"
        borderStyle="solid"
        borderColor="$secondary"
      >
        <Box display={{ xs: "none", md: "flex" }}>
          <Card>
            <ResumoFinanceiroChart
              receitasMes={receitasMes}
              despesasMes={despesasMes}
              saldosMes={saldosMes}
            />
          </Card>
        </Box>
        <SaudeFinanceiraCard
          saudeFinanceira={analyticsOrcamentoData?.data?.saudeFinanceira}
          isLoading={loadingAnalyticsOrcamento}
          title="💚 Saúde Financeira"
        />
        <PadroesTemporaisCard
          data={analyticsPadroesTemporaisData?.data}
          isLoading={loadingAnalyticsPadroesTemporais}
        />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          md: "1fr",
          xl: "3fr 1fr",
        }}
        gap="$s"
        padding="$s"
        borderRadius="$lg"
        backgroundColor="$background"
        borderWidth="$1"
        borderStyle="solid"
        borderColor="$secondary"
      >
        <Card>
          <ResumoPorCategoriaTable
            despesasPorCategoriaAno={despesasPorCategoriaAno}
            despesasPorCategoriaMes={despesasPorCategoriaMes}
          />
        </Card>
        <MeiosPagamentoChart
          meiosPagamento={analyticsMeiosPagamentoData?.data?.meiosPagamento}
          formasPagamento={analyticsMeiosPagamentoData?.data?.formasPagamento}
          resumo={analyticsMeiosPagamentoData?.data?.resumo}
          isLoading={loadingAnalyticsMeiosPagamento}
          title="Meios de Pagamento"
        />
      </Box>

      <Loading isLoading={isLoading} />
    </Box>
  );
};

export default Home;
