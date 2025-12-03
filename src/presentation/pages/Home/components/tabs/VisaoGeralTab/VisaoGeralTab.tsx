import { Box, Title } from "@rarui-react/components";
import React, { useMemo } from "react";

import { MiniCalendar } from "@/presentation/components";
import {
  useGetAnalyticsCategorias,
  useGetAnalyticsOrcamento,
  useGetAnalyticsPadroesTemporais,
  useGetCalendario,
  useGetQuickStats,
  useGetResumoFinanceiro,
} from "@/presentation/hooks/api";

import { Card, QuickStatCard } from "../../shared";
import { PadroesTemporaisCard, SaudeFinanceiraCard } from "../../analytics";
import { TopCategoriasCard } from "../../categorias";
import { ResumoFinanceiroChart, ResumoMensalTable } from "../../resumo";
import type { VisaoGeralTabProps } from "./VisaoGeralTab.types";

const VisaoGeralTab: React.FC<VisaoGeralTabProps> = ({
  year,
  month,
  miniCalendarMonth,
  miniCalendarYear,
  onNavigateMiniCalendar,
}) => {
  // Resumo Financeiro
  const { data: resumoData } = useGetResumoFinanceiro(
    { ano: year },
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  );

  // Calendário
  const { data: calendarioData, isLoading: loadingCalendario } =
    useGetCalendario(
      {
        ano: miniCalendarYear,
        mes: miniCalendarMonth,
      },
      {
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
    );

  // Analytics de Categorias
  const {
    data: analyticsCategoriasData,
    isLoading: loadingAnalyticsCategorias,
  } = useGetAnalyticsCategorias(
    {
      ano: year,
      mes: month,
      limit: 5,
    },
    {
      staleTime: 3 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  );

  // Analytics de Orçamento
  const { data: analyticsOrcamentoData, isLoading: loadingAnalyticsOrcamento } =
    useGetAnalyticsOrcamento(
      {
        ano: year,
        mes: month,
      },
      {
        staleTime: 3 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    );

  // Quick Stats
  const { data: quickStatsData, isLoading: loadingQuickStats } =
    useGetQuickStats(
      {
        ano: year,
        mes: month,
      },
      {
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
    );

  // Analytics de Padrões Temporais
  const {
    data: analyticsPadroesTemporaisData,
    isLoading: loadingAnalyticsPadroesTemporais,
  } = useGetAnalyticsPadroesTemporais({
    ano: year,
    mes: month,
  });

  // Dados processados
  const resumo = resumoData?.data;
  const {
    receitasMes,
    despesasMes,
    saldosMes,
    receitasAno,
    despesasAno,
    saldosMesAno,
  } = useMemo(
    () => ({
      receitasMes: resumo?.receitasMes ?? [],
      despesasMes: resumo?.despesasMes ?? [],
      saldosMes: resumo?.saldosMes ?? [],
      receitasAno: resumo?.receitasAno ?? 0,
      despesasAno: resumo?.despesasAno ?? 0,
      saldosMesAno: resumo?.saldosMesAno ?? 0,
    }),
    [resumo],
  );

  return (
    <Box display="flex" flexDirection="column" gap="$s" pt="$s">
      {/* Quick Stats - Insights Rápidos */}
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
      >
        <Title as="h6" color="$secondary" textAlign="center">
          ⚡ Insights Financeiros {year}
        </Title>

        <Box
          display="flex"
          gap="$s"
          flexDirection={{ xs: "column", lg: "row" }}
        >
          {/* Grid dos Quick Stats */}
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
              onNavigateMonth={onNavigateMiniCalendar}
              isLoading={loadingCalendario}
            />
          </Box>
        </Box>
      </Box>

      {/* Tabela Resumo Mensal + Top Categorias */}
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

      {/* Gráficos e Analytics */}
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
    </Box>
  );
};

export default VisaoGeralTab;
