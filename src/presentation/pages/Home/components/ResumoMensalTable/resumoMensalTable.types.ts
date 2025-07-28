import { ReceitaPorMes, DespesaPorMes } from "@/domain/models";

export interface ResumoMensalTableProps {
  totalReceitasAno: number;
  totalDespesasAno: number;
  receitas: ReceitaPorMes[];
  despesas: DespesaPorMes[];
  isLoading: boolean;
}
