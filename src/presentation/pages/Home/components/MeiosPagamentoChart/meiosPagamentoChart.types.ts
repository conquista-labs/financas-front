import type { FormaPagamentoAnalyticsDto } from "@/domain/models/formaPagamentoAnalyticsDto";
import type { MeioPagamentoAnalyticsDto } from "@/domain/models/meioPagamentoAnalyticsDto";
import type { ResumoMeiosPagamentoDto } from "@/domain/models/resumoMeiosPagamentoDto";

export interface MeiosPagamentoChartProps {
  meiosPagamento?: MeioPagamentoAnalyticsDto[];
  formasPagamento?: FormaPagamentoAnalyticsDto;
  resumo?: ResumoMeiosPagamentoDto;
  isLoading?: boolean;
  title?: string;
}
