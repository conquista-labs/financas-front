export interface UseHomeDataParams {
  year: number;
  month: number;
  miniCalendarMonth: number;
  miniCalendarYear: number;
}

export interface UseHomeDataLoadingStates {
  resumo: boolean;
  calendario: boolean;
  analyticsCategorias: boolean;
  analyticsOrcamento: boolean;
  analyticsMeiosPagamento: boolean;
  quickStats: boolean;
  analyticsPadroesTemporais: boolean;
  updating: boolean;
}

export interface UseHomeDataReturn {
  // Resumo Financeiro
  receitasMes: any[];
  despesasMes: any[];
  saldosMes: any[];
  receitasAno: number;
  despesasAno: number;
  despesasPorCategoriaAno: any[];
  despesasPorCategoriaMes: any[];
  saldosMesAno: number;
  atualizadoEm?: string;

  // Calendário
  calendarioData?: any;

  // Analytics
  analyticsCategoriasData?: any;
  analyticsOrcamentoData?: any;
  analyticsMeiosPagamentoData?: any;
  quickStatsData?: any;
  analyticsPadroesTemporaisData?: any;

  // Estados de loading
  isLoading: boolean;
  isLoadingAnyData: boolean;
  loadingStates: UseHomeDataLoadingStates;

  // Ações
  handleRefreshData: () => void;
  invalidateSpecificCache: (cacheKeys: string[]) => void;
}
