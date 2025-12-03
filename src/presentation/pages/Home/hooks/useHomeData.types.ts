export interface UseHomeDataParams {
  year: number;
}

export interface UseHomeDataReturn {
  // Estados de loading
  isLoading: boolean;

  // Ações
  handleRefreshData: () => void;
}
