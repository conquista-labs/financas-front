import { CalendarioData } from "@/domain/models";

export interface CalendarProps {
  data?: CalendarioData;
  currentMonth: number;
  currentYear: number;
  onNavigateMonth: (month: number, year: number) => void;
  onHandleToday: () => void;
  isLoading?: boolean;
}
