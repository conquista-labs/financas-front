import { ReceitaPorMes, DespesaPorMes } from "@/domain/models";

export interface ResumoFinanceiroChartProps {
  receitasMes: ReceitaPorMes[];
  despesasMes: DespesaPorMes[];
}
