import {
  DespesaPorCategoria,
  DespesaPorCategoriaPorMes,
} from "@/domain/models";

export interface ResumoPorCategoriaTableProps {
  despesasCategoriasMes: DespesaPorCategoriaPorMes[];
  despesasCategoriasAno: DespesaPorCategoria[];
  isLoading: boolean;
}
