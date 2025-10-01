import { useMemo } from "react";
import {
  startOfMonth,
  startOfWeek,
  addDays,
  format,
  getMonth,
  getDate,
  subMonths,
  addMonths,
  getYear,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalendarioData, DiaCalendario } from "@/domain/models";

export interface CalendarDay {
  date: Date;
  dayKey: string;
  isCurrentMonth: boolean;
  dayData: DiaCalendario | undefined;
  day: number;
  isToday: boolean;
}

export interface UseCalendarLogicProps {
  data?: CalendarioData;
  currentMonth: number;
  currentYear: number;
  onNavigateMonth: (month: number, year: number) => void;
}

export interface UseCalendarLogicReturn {
  calendarDays: CalendarDay[];
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  currentMonthName: string;
}

export const useCalendarLogic = ({
  data,
  currentMonth,
  currentYear,
  onNavigateMonth,
}: UseCalendarLogicProps): UseCalendarLogicReturn => {
  const calendarDays = useMemo(() => {
    const firstDay = startOfMonth(new Date(currentYear, currentMonth - 1, 1));
    const startDate = startOfWeek(firstDay, { weekStartsOn: 0 });
    const days: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const current = addDays(startDate, i);
      const dayKey = format(current, "yyyy-MM-dd");
      const isCurrentMonth = getMonth(current) === currentMonth - 1;
      const dayData = data?.diasDoMes?.find((dia) => dia.data === dayKey);

      days.push({
        date: current,
        dayKey,
        isCurrentMonth,
        dayData,
        day: getDate(current),
        isToday: isToday(current),
      });
    }

    return days;
  }, [currentYear, currentMonth, data]);

  const handlePrevMonth = () => {
    const prevMonth = subMonths(new Date(currentYear, currentMonth - 1, 1), 1);
    onNavigateMonth(getMonth(prevMonth) + 1, getYear(prevMonth));
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(new Date(currentYear, currentMonth - 1, 1), 1);
    onNavigateMonth(getMonth(nextMonth) + 1, getYear(nextMonth));
  };

  const currentMonthName = format(
    new Date(currentYear, currentMonth - 1, 1),
    "MMMM yyyy",
    { locale: ptBR },
  );

  return {
    calendarDays,
    handlePrevMonth,
    handleNextMonth,
    currentMonthName,
  };
};
