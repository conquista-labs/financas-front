import { ReceitaPorMes, DespesaPorMes } from "@/domain/models";

export interface ResumoMensalTableProps {
  receitas: ReceitaPorMes[];
  despesas: DespesaPorMes[];
  isLoading: boolean;
}
