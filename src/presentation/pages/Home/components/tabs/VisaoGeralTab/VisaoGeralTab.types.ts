export interface VisaoGeralTabProps {
  year: number;
  month: number;
  miniCalendarMonth: number;
  miniCalendarYear: number;
  onNavigateMiniCalendar: (month: number, year: number) => void;
}
