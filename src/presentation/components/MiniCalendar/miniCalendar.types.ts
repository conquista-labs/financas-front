import type { CalendarioData, DiaCalendario } from "@/domain/models";

export interface MiniCalendarProps {
  data?: CalendarioData;
  currentMonth: number;
  currentYear: number;
  onNavigateMonth: (month: number, year: number) => void;
  onDayClick?: (dayData: DiaCalendario | null, dayKey: string) => void;
  isLoading?: boolean;
}
