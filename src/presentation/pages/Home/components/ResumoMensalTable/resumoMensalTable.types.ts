import { ReceitaPorMes, DespesaPorMes, SaldosPorMes } from "@/domain/models";

export interface ResumoMensalTableProps {
  receitasAno: number;
  despesasAno: number;
  saldosMesAno: number;
  saldosMes: SaldosPorMes[];
  receitasMes: ReceitaPorMes[];
  despesasMes: DespesaPorMes[];
  isLoading?: boolean;
}
