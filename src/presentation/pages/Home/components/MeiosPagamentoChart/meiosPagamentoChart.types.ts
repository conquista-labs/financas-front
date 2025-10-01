import { MeioPagamentoAnalyticsDto } from "@/domain/models/meioPagamentoAnalyticsDto";
import { FormaPagamentoAnalyticsDto } from "@/domain/models/formaPagamentoAnalyticsDto";
import { ResumoMeiosPagamentoDto } from "@/domain/models/resumoMeiosPagamentoDto";

export interface MeiosPagamentoChartProps {
  meiosPagamento?: MeioPagamentoAnalyticsDto[];
  formasPagamento?: FormaPagamentoAnalyticsDto;
  resumo?: ResumoMeiosPagamentoDto;
  isLoading?: boolean;
  title?: string;
}
