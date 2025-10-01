import React, { useMemo, useState } from "react";
import { Box, Datepicker, IconButton, Text } from "@rarui-react/components";
import {
  useGetResumoFinanceiro,
  usePostResumoFinanceiro,
  useGetCalendario,
  useGetAnalyticsCategorias,
  useGetAnalyticsOrcamento,
  useGetAnalyticsTendencias,
  useGetAnalyticsMeiosPagamento,
  useGetQuickStats,
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
  TendenciasChart,
  MeiosPagamentoChart,
  QuickStatCard,
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

  // Analytics de Tendências
  const {
    data: analyticsTendenciasData,
    isLoading: loadingAnalyticsTendencias,
  } = useGetAnalyticsTendencias({
    ano: Number(year),
    mes: new Date().getMonth() + 1, // Mês atual
    mesesHistorico: 12,
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
  const saldoAno = resumo?.saldoAno ?? 0;
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
      >
        {/* Título da seção principal */}
        <Text
          fontSize="$l"
          fontWeight="$bold"
          color="$primary"
          textAlign="center"
        >
          ⚡ Insights Financeiros {year}
        </Text>

        {/* Grid dos Quick Stats - 2x3 em desktop, 1 coluna em mobile */}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap="$md"
        >
          {loadingQuickStats ? (
            // Loading skeleton para 6 cards
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <QuickStatCard key={index} data={{} as any} isLoading />
              ))}
            </>
          ) : quickStatsData?.data ? (
            // Quick Stats cards
            <>
              <QuickStatCard data={quickStatsData.data.gastoSemana} />
              <QuickStatCard data={quickStatsData.data.economiaMes} />
              <QuickStatCard data={quickStatsData.data.maiorCategoria} />
              <QuickStatCard data={quickStatsData.data.diasSemGastos} />
              <QuickStatCard data={quickStatsData.data.transacaoMaior} />
              <QuickStatCard data={quickStatsData.data.comparativoAno} />
            </>
          ) : (
            // Fallback - mostra cards básicos se Quick Stats falhar
            <>
              <QuickStatCard
                data={
                  {
                    titulo: "Receitas do Ano",
                    valor: receitasAno,
                    icone: "💰",
                    cor: "$success",
                  } as any
                }
              />
              <QuickStatCard
                data={
                  {
                    titulo: "Despesas do Ano",
                    valor: despesasAno,
                    icone: "💳",
                    cor: "$error",
                  } as any
                }
              />
              <QuickStatCard
                data={
                  {
                    titulo: "Saldo do Ano",
                    valor: saldoAno,
                    icone: "📊",
                    cor: saldoAno >= 0 ? "$success" : "$error",
                  } as any
                }
              />
              <QuickStatCard
                data={
                  {
                    titulo: "Em Breve",
                    valor: "...",
                    icone: "🔄",
                    subtitulo: "Carregando dados",
                  } as any
                }
              />
              <QuickStatCard
                data={
                  {
                    titulo: "Em Breve",
                    valor: "...",
                    icone: "🔄",
                    subtitulo: "Carregando dados",
                  } as any
                }
              />
              <QuickStatCard
                data={
                  {
                    titulo: "Em Breve",
                    valor: "...",
                    icone: "🔄",
                    subtitulo: "Carregando dados",
                  } as any
                }
              />
            </>
          )}
        </Box>
      </Box>

      {/* 🎯 SEÇÃO 3: Visualizações Auxiliares - Gráfico + Calendário */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          lg: "1fr 1fr",
          xl: "2fr 1fr",
        }}
        gap="$s"
        padding="$s"
        borderRadius="$lg"
        backgroundColor="$background"
        borderWidth="$1"
        borderStyle="solid"
        borderColor="$secondary"
      >
        {/* Gráfico de Receitas/Despesas */}
        <Card>
          <ResumoFinanceiroChart
            receitasMes={receitasMes}
            despesasMes={despesasMes}
            saldosMes={saldosMes}
          />
        </Card>

        {/* Mini Calendário - Desktop e Tablet */}
        <Box display={{ xs: "none", lg: "block" }}>
          <MiniCalendar
            data={calendarioData?.data}
            currentMonth={miniCalendarMonth}
            currentYear={miniCalendarYear}
            onNavigateMonth={handleMiniCalendarNavigate}
            isLoading={loadingCalendario}
          />
        </Box>
      </Box>

      {/* 🎯 SEÇÃO 4: Analytics e Insights */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          lg: "1fr 1fr",
          xl: "1fr 1fr",
        }}
        gap="$s"
        padding="$s"
        borderRadius="$lg"
        backgroundColor="$background"
        borderWidth="$1"
        borderStyle="solid"
        borderColor="$secondary"
      >
        {/* Top Categorias */}
        <TopCategoriasCard
          categorias={analyticsCategoriasData?.data?.categorias}
          totalGeral={analyticsCategoriasData?.data?.totalGeral}
          isLoading={loadingAnalyticsCategorias}
          title="🏆 Top Categorias do Mês"
        />

        {/* Saúde Financeira */}
        <SaudeFinanceiraCard
          saudeFinanceira={analyticsOrcamentoData?.data?.saudeFinanceira}
          isLoading={loadingAnalyticsOrcamento}
          title="💚 Saúde Financeira"
        />

        {/* Tendências e Projeções */}
        <TendenciasChart
          evolucaoMensal={analyticsTendenciasData?.data?.evolucaoMensal}
          projecaoMesAtual={analyticsTendenciasData?.data?.projecaoMesAtual}
          insights={analyticsTendenciasData?.data?.insights}
          isLoading={loadingAnalyticsTendencias}
          title="Tendências Financeiras"
        />

        {/* Meios de Pagamento */}
        <MeiosPagamentoChart
          meiosPagamento={analyticsMeiosPagamentoData?.data?.meiosPagamento}
          formasPagamento={analyticsMeiosPagamentoData?.data?.formasPagamento}
          resumo={analyticsMeiosPagamentoData?.data?.resumo}
          isLoading={loadingAnalyticsMeiosPagamento}
          title="Meios de Pagamento"
        />
      </Box>

      {/* Mobile: Tabs para Gráfico, Calendário e Resumo */}
      {/* <Box display={{ xs: "block", lg: "none" }}>
        <Tabs defaultValue="grafico" variant="underlined">
          <Tabs.List>
            <Tabs.Tab value="grafico">Gráfico</Tabs.Tab>
            <Tabs.Tab value="calendario">Calendário</Tabs.Tab>
            <Tabs.Tab value="resumo">Resumo</Tabs.Tab>
          </Tabs.List>

          <TabPanel value="grafico">
            <Card marginTop="$s">
              <ResumoFinanceiroChart
                receitasMes={receitasMes}
                despesasMes={despesasMes}
                saldosMes={saldosMes}
              />
            </Card>
          </TabPanel>

          <TabPanel value="calendario">
            <Box marginTop="$s">
              <MiniCalendar
                data={calendarioData?.data}
                currentMonth={miniCalendarMonth}
                currentYear={miniCalendarYear}
                onNavigateMonth={handleMiniCalendarNavigate}
                isLoading={loadingCalendario}
              />
            </Box>
          </TabPanel>

          <TabPanel value="resumo">
            <Card>
              <ResumoMensalTable
                receitasMes={receitasMes}
                despesasMes={despesasMes}
                receitasAno={receitasAno}
                despesasAno={despesasAno}
                saldosMes={saldosMes}
                saldosMesAno={saldosMesAno}
              />
            </Card>
          </TabPanel>
        </Tabs>
      </Box> */}

      {/* Desktop/Tablet: Tabela Resumo Mensal - Destaque Principal */}
      <Box display={{ xs: "none", lg: "block" }}>
        <Card>
          <ResumoMensalTable
            receitasMes={receitasMes}
            despesasMes={despesasMes}
            receitasAno={receitasAno}
            despesasAno={despesasAno}
            saldosMes={saldosMes}
            saldosMesAno={saldosMesAno}
          />
        </Card>
      </Box>
      <Card>
        <ResumoPorCategoriaTable
          despesasPorCategoriaAno={despesasPorCategoriaAno}
          despesasPorCategoriaMes={despesasPorCategoriaMes}
        />
      </Card>
      <Loading isLoading={isLoading} />
    </Box>
  );
};

export default Home;
