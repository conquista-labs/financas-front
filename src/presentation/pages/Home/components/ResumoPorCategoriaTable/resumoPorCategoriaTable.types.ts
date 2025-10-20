import type {
  DespesaPorCategoriaAno,
  DespesaPorCategoriaMes,
} from "@/domain/models";

export interface ResumoPorCategoriaTableProps {
  despesasPorCategoriaMes: DespesaPorCategoriaMes[];
  despesasPorCategoriaAno: DespesaPorCategoriaAno[];
  isLoading?: boolean;
}
