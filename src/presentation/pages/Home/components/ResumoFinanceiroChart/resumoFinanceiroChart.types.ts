import { ReceitaPorMes, DespesaPorMes, SaldosPorMes } from "@/domain/models";

export interface ResumoFinanceiroChartProps {
  receitasMes: ReceitaPorMes[];
  despesasMes: DespesaPorMes[];
  saldosMes: SaldosPorMes[];
}
