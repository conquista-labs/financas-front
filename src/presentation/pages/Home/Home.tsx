import { ArrowLeftIcon, ArrowRightIcon } from "@rarui/icons";
import { Box, Datepicker, IconButton, Title } from "@rarui-react/components";
import { addYears, format, getMonth, getYear, subYears } from "date-fns";
import React, { useState } from "react";
import { StringParam, useQueryParams, withDefault } from "use-query-params";

import { Loading, MiniCalendar } from "@/presentation/components";
import { useAuthStore } from "@/presentation/store";

import {
  Card,
  Header,
  MeiosPagamentoChart,
  PadroesTemporaisCard,
  QuickStatCard,
  ResumoFinanceiroChart,
  ResumoMensalTable,
  ResumoPorCategoriaTable,
  SaudeFinanceiraCard,
  TopCategoriasCard,
} from "./components";
import { useHomeData } from "./hooks";

const Home: React.FC = () => {
  const [params, setParams] = useQueryParams({
    year: withDefault(StringParam, format(new Date(), "yyyy")),
    month: withDefault(StringParam, format(new Date(), "MM")),
  });

  const { auth } = useAuthStore();

  // Estado para navegação do mini calendário
  const [miniCalendarMonth, setMiniCalendarMonth] = useState(
    getMonth(new Date()) + 1,
  );
  const [miniCalendarYear, setMiniCalendarYear] = useState(Number(params.year));

  // Hook centralizado para todos os dados da Home
  const {
    // Dados processados
    receitasMes,
    despesasMes,
    saldosMes,
    receitasAno,
    despesasAno,
    despesasPorCategoriaAno,
    despesasPorCategoriaMes,
    saldosMesAno,
    atualizadoEm,
    calendarioData,
    analyticsCategoriasData,
    analyticsOrcamentoData,
    analyticsMeiosPagamentoData,
    quickStatsData,
    analyticsPadroesTemporaisData,

    // Estados de loading
    isLoading,
    loadingStates,

    // Ações
    handleRefreshData,
  } = useHomeData({
    year: Number(params.year),
    month: Number(params.month),
    miniCalendarMonth,
    miniCalendarYear,
  });

  const navigateYear = (direction: "prev" | "next") => {
    const operator = direction === "next" ? addYears : subYears;
    const date = new Date(Number(params.year), 0);
    const newYear = format(operator(date!, 1), "yyyy");
    setParams({ year: newYear });
  };

  const handleDateChange = (date: Date) => {
    setParams({ year: format(date, "yyyy"), month: format(date, "MM") });
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
          nome={auth.user.nome ?? ""}
          atualizadoEm={atualizadoEm}
          onAtualizar={handleRefreshData}
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
              dateFormat="MM/yyyy"
              showMonthYearPicker
              selected={new Date(Number(params.year), Number(params.month) - 1)}
              onChange={(date) => handleDateChange(date as Date)}
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
          ⚡ Insights Financeiros {params.year}
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
              data={quickStatsData?.gastoSemana}
              isLoading={loadingStates.quickStats}
            />
            <QuickStatCard
              data={quickStatsData?.economiaMes}
              isLoading={loadingStates.quickStats}
            />
            <QuickStatCard
              data={quickStatsData?.maiorCategoria}
              isLoading={loadingStates.quickStats}
            />
            <QuickStatCard
              data={quickStatsData?.diasSemGastos}
              isLoading={loadingStates.quickStats}
            />
            <QuickStatCard
              data={quickStatsData?.transacaoMaior}
              isLoading={loadingStates.quickStats}
            />
            <QuickStatCard
              data={quickStatsData?.comparativoAno}
              isLoading={loadingStates.quickStats}
            />
          </Box>
          <Box order={{ xs: 1, lg: 2 }}>
            <MiniCalendar
              data={calendarioData}
              currentMonth={miniCalendarMonth}
              currentYear={miniCalendarYear}
              onNavigateMonth={handleMiniCalendarNavigate}
              isLoading={loadingStates.calendario}
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
          categorias={analyticsCategoriasData?.categorias}
          totalGeral={analyticsCategoriasData?.totalGeral}
          isLoading={loadingStates.analyticsCategorias}
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
          saudeFinanceira={analyticsOrcamentoData?.saudeFinanceira}
          isLoading={loadingStates.analyticsOrcamento}
          title="💚 Saúde Financeira"
        />
        <PadroesTemporaisCard
          data={analyticsPadroesTemporaisData}
          isLoading={loadingStates.analyticsPadroesTemporais}
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
          meiosPagamento={analyticsMeiosPagamentoData?.meiosPagamento}
          formasPagamento={analyticsMeiosPagamentoData?.formasPagamento}
          resumo={analyticsMeiosPagamentoData?.resumo}
          isLoading={loadingStates.analyticsMeiosPagamento}
          title="Meios de Pagamento"
        />
      </Box>

      <Loading isLoading={isLoading} />
    </Box>
  );
};

export default Home;
