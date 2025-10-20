import type {
  DespesaPorMes,
  ReceitaPorMes,
  SaldosPorMes,
} from "@/domain/models";

export interface ResumoFinanceiroChartProps {
  receitasMes: ReceitaPorMes[];
  despesasMes: DespesaPorMes[];
  saldosMes: SaldosPorMes[];
  isLoading?: boolean;
}
