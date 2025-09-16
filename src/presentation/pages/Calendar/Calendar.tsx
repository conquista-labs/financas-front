import { useCallback, useState } from "react";
import { Box } from "@rarui-react/components";
import { getMonth, getYear } from "date-fns";

import {
  Breadcrumb,
  Calendar as CalendarComponent,
} from "@/presentation/components";
import { useGetCalendario } from "@/presentation/hooks/api";

const Calendar: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(getMonth(today) + 1);
  const [currentYear, setCurrentYear] = useState(getYear(today));

  const { data, isLoading } = useGetCalendario({
    ano: currentYear,
    mes: currentMonth,
  });
  console.log(data);

  const handleNavigateMonth = useCallback((month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  }, []);

  const handleToday = useCallback(() => {
    const now = new Date();
    setCurrentMonth(getMonth(now) + 1);
    setCurrentYear(getYear(now));
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="$md"
      padding="$md"
      overflow="auto"
    >
      <Breadcrumb crumbs={["calendar"]} />

      <Box
        flex="1"
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        paddingTop="$md"
      >
        <CalendarComponent
          data={data?.data}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onNavigateMonth={handleNavigateMonth}
          onHandleToday={handleToday}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default Calendar;
