import type { EvolucaoPatrimonio, ResumoPatrimonio } from "@/domain/models";

export interface PatrimonyCardProps {
  data?: ResumoPatrimonio;
  isLoading?: boolean;
  evolucaoData?: EvolucaoPatrimonio;
  selectedMonth: number;
  selectedYear: number;
}
