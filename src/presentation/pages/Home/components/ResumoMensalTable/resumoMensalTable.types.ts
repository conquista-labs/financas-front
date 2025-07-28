import { ReceitaPorMes, DespesaPorMes } from "@/domain/models";

export interface ResumoMensalTableProps {
  receitasAno: number;
  despesasAno: number;
  receitasMes: ReceitaPorMes[];
  despesasMes: DespesaPorMes[];
}
