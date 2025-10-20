import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  useGetAnalyticsCategorias,
  useGetAnalyticsMeiosPagamento,
  useGetAnalyticsOrcamento,
  useGetAnalyticsPadroesTemporais,
  useGetCalendario,
  useGetQuickStats,
  useGetResumoFinanceiro,
  usePostResumoFinanceiro,
} from "@/presentation/hooks/api";

import type { UseHomeDataParams } from "./useHomeData.types";

export const useHomeData = ({
  year,
  month,
  miniCalendarMonth,
  miniCalendarYear,
}: UseHomeDataParams) => {
  const queryClient = useQueryClient();

  // Resumo Financeiro
  const {
    data: resumoData,
    isLoading: loadingResumo,
    refetch: refetchResumo,
  } = useGetResumoFinanceiro(
    { ano: year },
    {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
  );

  const { mutate: updateResumo, isPending: updatingResumo } =
    usePostResumoFinanceiro();

  // Calendário
  const { data: calendarioData, isLoading: loadingCalendario } =
    useGetCalendario(
      {
        ano: miniCalendarYear,
        mes: miniCalendarMonth,
      },
      {
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 5 * 60 * 1000, // 5 minutos
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
      staleTime: 3 * 60 * 1000, // 3 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
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
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
      },
    );

  // Analytics de Meios de Pagamento
  const {
    data: analyticsMeiosPagamentoData,
    isLoading: loadingAnalyticsMeiosPagamento,
  } = useGetAnalyticsMeiosPagamento(
    {
      ano: year,
      mes: month,
    },
    {
      staleTime: 3 * 60 * 1000, // 3 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
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
        staleTime: 1 * 60 * 1000, // 1 minuto (dados mais dinâmicos)
        gcTime: 5 * 60 * 1000, // 5 minutos
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

  // Estados de loading consolidados
  const isLoading = useMemo(
    () => loadingResumo || updatingResumo,
    [loadingResumo, updatingResumo],
  );

  const isLoadingAnyData = useMemo(
    () =>
      loadingResumo ||
      updatingResumo ||
      loadingCalendario ||
      loadingAnalyticsCategorias ||
      loadingAnalyticsOrcamento ||
      loadingAnalyticsMeiosPagamento ||
      loadingQuickStats ||
      loadingAnalyticsPadroesTemporais,
    [
      loadingResumo,
      updatingResumo,
      loadingCalendario,
      loadingAnalyticsCategorias,
      loadingAnalyticsOrcamento,
      loadingAnalyticsMeiosPagamento,
      loadingQuickStats,
      loadingAnalyticsPadroesTemporais,
    ],
  );

  // Dados processados
  const processedData = useMemo(() => {
    const resumo = resumoData?.data;

    return {
      // Resumo Financeiro
      receitasMes: resumo?.receitasMes ?? [],
      despesasMes: resumo?.despesasMes ?? [],
      saldosMes: resumo?.saldosMes ?? [],
      receitasAno: resumo?.receitasAno ?? 0,
      despesasAno: resumo?.despesasAno ?? 0,
      despesasPorCategoriaAno: resumo?.despesasPorCategoriaAno ?? [],
      despesasPorCategoriaMes: resumo?.despesasPorCategoriaMes ?? [],
      saldosMesAno: resumo?.saldosMesAno ?? 0,
      atualizadoEm: resumo?.atualizadoEm,

      // Calendário
      calendarioData: calendarioData?.data,

      // Analytics
      analyticsCategoriasData: analyticsCategoriasData?.data,
      analyticsOrcamentoData: analyticsOrcamentoData?.data,
      analyticsMeiosPagamentoData: analyticsMeiosPagamentoData?.data,
      quickStatsData: quickStatsData?.data,
      analyticsPadroesTemporaisData: analyticsPadroesTemporaisData?.data,
    };
  }, [
    resumoData,
    calendarioData,
    analyticsCategoriasData,
    analyticsOrcamentoData,
    analyticsMeiosPagamentoData,
    quickStatsData,
    analyticsPadroesTemporaisData,
  ]);

  // Função para atualizar dados (invalidar cache)
  const handleRefreshData = () => {
    updateResumo(
      { year },
      {
        onSuccess: () => {
          // Invalidar todas as queries relacionadas à Home
          queryClient.invalidateQueries({
            queryKey: ["get-resumo-financeiro"],
          });
          queryClient.invalidateQueries({ queryKey: ["get-calendario"] });
          queryClient.invalidateQueries({
            queryKey: ["get", "analytics", "categorias"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get", "analytics", "orcamento"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get", "analytics", "meios-pagamento"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get", "analytics", "quick-stats"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get", "analytics", "padroes-temporais"],
          });

          // Refetch do resumo principal
          refetchResumo();
        },
      },
    );
  };

  // Função para invalidar cache específico
  const invalidateSpecificCache = (cacheKeys: string[]) => {
    cacheKeys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: ["get", key] });
    });
  };

  // Estados de loading específicos para componentes que precisam
  const loadingStates = {
    resumo: loadingResumo,
    calendario: loadingCalendario,
    analyticsCategorias: loadingAnalyticsCategorias,
    analyticsOrcamento: loadingAnalyticsOrcamento,
    analyticsMeiosPagamento: loadingAnalyticsMeiosPagamento,
    quickStats: loadingQuickStats,
    analyticsPadroesTemporais: loadingAnalyticsPadroesTemporais,
    updating: updatingResumo,
  };

  return {
    // Dados processados
    ...processedData,

    // Estados de loading
    isLoading,
    isLoadingAnyData,
    loadingStates,

    // Ações
    handleRefreshData,
    invalidateSpecificCache,
  };
};
