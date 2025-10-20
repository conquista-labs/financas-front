import type { EvolucaoMensalDto } from "@/domain/models/evolucaoMensalDto";
import type { InsightFinanceiroDto } from "@/domain/models/insightFinanceiroDto";
import type { ProjecaoMesDto } from "@/domain/models/projecaoMesDto";

export interface TendenciasChartProps {
  evolucaoMensal?: EvolucaoMensalDto[];
  projecaoMesAtual?: ProjecaoMesDto;
  insights?: InsightFinanceiroDto[];
  isLoading?: boolean;
  title?: string;
}
