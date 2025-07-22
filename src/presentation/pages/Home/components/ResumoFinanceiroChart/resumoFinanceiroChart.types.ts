import { ReceitaPorMes, DespesaPorMes } from "@/domain/models";

export interface ResumoFinanceiroChartProps {
  receitas: ReceitaPorMes[];
  despesas: DespesaPorMes[];
}
