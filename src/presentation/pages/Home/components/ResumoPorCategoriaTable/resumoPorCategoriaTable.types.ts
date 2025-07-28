import {
  DespesaPorCategoriaAno,
  DespesaPorCategoriaMes,
} from "@/domain/models";

export interface ResumoPorCategoriaTableProps {
  despesasPorCategoriaMes: DespesaPorCategoriaMes[];
  despesasPorCategoriaAno: DespesaPorCategoriaAno[];
}
