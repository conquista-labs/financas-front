import { ChevronLeftIcon, ChevronRightIcon } from "@rarui/icons";
import { Box, Button, Card, Text } from "@rarui-react/components";
import { useMemo, useState } from "react";
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
} from "date-fns";
import { ptBR } from "date-fns/locale";

import type { DiaCalendario } from "@/domain/models";
import { formatCurrency } from "@/presentation/pages/Home/home.definitions";
import { useIsMobile } from "@/presentation/hooks/core";

import type { CalendarProps } from "./calendar.types";
import { DAYS_OF_WEEK } from "./calendar.definitions";
import { DailyTransactionsModal } from "./components";

const Calendar: React.FC<CalendarProps> = ({
  data,
  currentMonth,
  currentYear,
  onNavigateMonth,
  onHandleToday,
  isLoading = false,
}) => {
  const { isMobile } = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState<DiaCalendario | null>(
    null,
  );
  const calendarDays = useMemo(() => {
    const firstDay = startOfMonth(new Date(currentYear, currentMonth - 1, 1));
    const startDate = startOfWeek(firstDay, { weekStartsOn: 0 });
    const days = [];

    for (let i = 0; i < 35; i++) {
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

  const handleDayClick = (dayData: DiaCalendario) => {
    if (dayData.quantidadeTransacoes > 0) {
      setSelectedDayData(dayData);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDayData(null);
  };

  return (
    <Box width="100%">
      <Card padding="none">
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$xs"
          padding="$xs"
          backgroundColor="$transparent"
          borderColor="$subdued"
          borderBottomWidth="$1"
          borderStyle="solid"
        >
          <Box>
            <Text
              fontSize="$l"
              fontWeight="$bold"
              color="$primary"
              textTransform="capitalize"
            >
              {format(new Date(currentYear, currentMonth - 1, 1), "MMMM", {
                locale: ptBR,
              })}{" "}
              {currentYear}
            </Text>
          </Box>
          <Box display="flex" gap={{ xs: "$4xs", md: "$3xs" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handlePrevMonth}
              disabled={isLoading}
            >
              <ChevronLeftIcon size="medium" />
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={onHandleToday}
              disabled={isLoading}
            >
              Hoje
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleNextMonth}
              disabled={isLoading}
            >
              <ChevronRightIcon size="medium" />
            </Button>
          </Box>
        </Box>

        <Box pt="$none" padding="$2xs">
          {/* Days of week header */}
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap="$3xs">
            {DAYS_OF_WEEK.map((day) => (
              <Box
                key={day}
                minHeight={{ xs: "30px", md: "40px" }}
                display="flex"
                alignItems="center"
                padding={{ xs: "$3xs", md: "$xs" }}
                textAlign="center"
                backgroundColor="$transparent"
                borderRadius="$xs"
              >
                <Text
                  fontSize={{ xs: "$xs", md: "$s" }}
                  fontWeight="$bold"
                  color="$secondary"
                >
                  {day}
                </Text>
              </Box>
            ))}
          </Box>

          {/* Calendar days */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            marginBottom="$xs"
            gap="$3xs"
          >
            {calendarDays.map(({ dayKey, isCurrentMonth, dayData, day }) => (
              <Box
                key={dayKey}
                padding={{ xs: "$3xs", md: "$xs" }}
                borderRadius="$xs"
                borderWidth="$1"
                borderStyle="solid"
                borderColor="$divider"
                minHeight={{ xs: "80px", md: "100px" }}
                display="flex"
                flexDirection="column"
                position="relative"
                cursor={
                  isCurrentMonth && dayData?.quantidadeTransacoes
                    ? "pointer"
                    : "default"
                }
                backgroundColor={isCurrentMonth ? "$transparent" : "$disabled"}
                pointerEvents={!isCurrentMonth ? "none" : "auto"}
                opacity={`${isCurrentMonth ? 1 : 0.5}`}
                onClick={() =>
                  isCurrentMonth && dayData && handleDayClick(dayData)
                }
              >
                {/* Day number */}
                <Box marginBottom="$4xs">
                  <Text
                    fontSize={{ xs: "$xs", md: "$s" }}
                    fontWeight="$bold"
                    color={isCurrentMonth ? "$secondary" : "$disabled"}
                  >
                    {day}
                  </Text>
                </Box>

                {/* Transactions */}
                {isCurrentMonth && dayData?.transacoes && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="$4xs"
                    mt="$4xs"
                  >
                    {dayData.transacoes
                      .slice(0, isMobile ? 2 : 3)
                      .map((transacao, index) => (
                        <Box
                          key={`${dayKey}-${index}`}
                          borderRadius="$xs"
                          borderStyle="solid"
                          display="flex"
                          justifyContent="space-between"
                        >
                          <Box display="flex" alignItems="center" gap="$4xs">
                            <div
                              style={{
                                height: "100%",
                                width: "6px",
                                borderRadius: "2px",
                                backgroundColor: `${transacao.categoria?.cor}`,
                              }}
                            />
                            <Text
                              fontSize="$xxs"
                              color="$primary"
                              fontWeight="$semiBold"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                            >
                              {transacao.descricao}
                            </Text>
                          </Box>
                          <Text fontSize="$xxs" color="$error">
                            {formatCurrency(transacao.valor)}
                          </Text>
                        </Box>
                      ))}

                    {dayData.quantidadeTransacoes > (isMobile ? 2 : 3) && (
                      <Box
                        as="button"
                        width="fit-content"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        borderRadius="$2xs"
                        backgroundColor={{
                          hover: "$secondary",
                          xs: "$transparent",
                        }}
                        borderWidth="$none"
                        cursor="pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDayClick(dayData);
                        }}
                      >
                        <Text
                          fontSize="$xxs"
                          color="$secondary"
                          textAlign="center"
                        >
                          +{dayData.quantidadeTransacoes - (isMobile ? 2 : 3)}{" "}
                          mais
                        </Text>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Card>

      <DailyTransactionsModal
        open={modalOpen}
        onClose={handleCloseModal}
        dayData={selectedDayData}
      />
    </Box>
  );
};

export default Calendar;
