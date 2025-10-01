import { EvolucaoMensalDto } from "@/domain/models/evolucaoMensalDto";
import { ProjecaoMesDto } from "@/domain/models/projecaoMesDto";
import { InsightFinanceiroDto } from "@/domain/models/insightFinanceiroDto";

export interface TendenciasChartProps {
  evolucaoMensal?: EvolucaoMensalDto[];
  projecaoMesAtual?: ProjecaoMesDto;
  insights?: InsightFinanceiroDto[];
  isLoading?: boolean;
  title?: string;
}
