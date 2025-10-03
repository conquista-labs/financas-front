import { ChevronLeftIcon, ChevronRightIcon } from "@rarui/icons";
import { Box, Button, Card, Text, Tooltip } from "@rarui-react/components";
import { getMonth, getYear } from "date-fns";

import type { DiaCalendario } from "@/domain/models";
import { formatCurrency } from "@/presentation/pages/Home/home.definitions";
import {
  navigateTo,
  urlRouters,
} from "@/presentation/router/router.definitions";
import { useCalendarLogic } from "@/presentation/hooks/core";

import { DAYS_OF_WEEK_SHORT } from "./miniCalendar.definitions";
import type { MiniCalendarProps } from "./miniCalendar.types";
import { Loading } from "../Loading";

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  data,
  currentMonth,
  currentYear,
  onNavigateMonth,
  onDayClick,
  isLoading = false,
}) => {
  const { calendarDays, handlePrevMonth, handleNextMonth, currentMonthName } =
    useCalendarLogic({
      data,
      currentMonth,
      currentYear,
      onNavigateMonth,
    });

  const handleDayClick = (dayData: DiaCalendario | null, dayKey: string) => {
    if (onDayClick) {
      onDayClick(dayData, dayKey);
    } else {
      // Navegar para o calendário completo na data selecionada
      const selectedDate = new Date(dayKey);
      const month = getMonth(selectedDate) + 1;
      const year = getYear(selectedDate);

      // Usando URL params para definir mês/ano do calendário
      navigateTo(`${urlRouters.calendar}?mes=${month}&ano=${year}`);
    }
  };

  const getTooltipContent = (dayData: DiaCalendario | null) => {
    if (!dayData?.quantidadeTransacoes) return null;

    return (
      <Box display="flex" flexDirection="column" gap="$4xs">
        <Text color="$invert" fontSize="$s">
          {dayData.quantidadeTransacoes}{" "}
          {dayData.quantidadeTransacoes > 1 ? "transações" : "transação"}
        </Text>
        <Text color="$invert" fontSize="$s">
          total: {formatCurrency(dayData.totalDespesas)}
        </Text>
      </Box>
    );
  };

  return (
    <Box
      position="relative"
      height="fit-content"
      minWidth={{ xs: "100%", lg: "600px" }}
    >
      <Card padding="none">
        {/* Header de navegação */}
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
          <Text
            fontSize="$s"
            fontWeight="$bold"
            color="$primary"
            textTransform="capitalize"
          >
            {currentMonthName}
          </Text>
          <Box display="flex" gap="$4xs">
            <Button
              variant="outlined"
              size="small"
              onClick={handlePrevMonth}
              disabled={isLoading}
            >
              <ChevronLeftIcon size="small" />
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleNextMonth}
              disabled={isLoading}
            >
              <ChevronRightIcon size="small" />
            </Button>
          </Box>
        </Box>

        {/* Days of week header */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(7, minmax(32px, 1fr))"
          gap="$4xs"
          paddingX="$3xs"
          paddingBottom="$3xs"
        >
          {DAYS_OF_WEEK_SHORT.map((day, index) => (
            <Box
              key={`${day}-${index}`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              minHeight="20px"
            >
              <Text
                fontSize="$xxs"
                fontWeight="$semiBold"
                color="$secondary"
                textAlign="center"
              >
                {day}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Calendar days */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(7, minmax(32px, 1fr))"
          gap="$4xs"
          paddingX="$3xs"
          paddingBottom="$3xs"
        >
          {calendarDays.map(
            ({ dayKey, isCurrentMonth, dayData, day, isToday }) => {
              const tooltipContent = getTooltipContent(dayData ?? null);
              const hasTransactions = (dayData?.quantidadeTransacoes ?? 0) > 0;

              const dayCell = (
                <Box
                  key={dayKey}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  height="32px"
                  // width="32px"
                  borderRadius="$xs"
                  cursor={isCurrentMonth ? "pointer" : "default"}
                  backgroundColor={{
                    xs: isToday && isCurrentMonth ? "$brand" : "$transparent",
                    hover: isCurrentMonth ? "$brand-hover" : "$background",
                  }}
                  opacity={isCurrentMonth ? `1` : `0.3`}
                  onClick={() =>
                    isCurrentMonth && handleDayClick(dayData || null, dayKey)
                  }
                  borderWidth="$1"
                  borderStyle="solid"
                  borderColor="$divider"
                >
                  <Text
                    fontSize="$xxs"
                    fontWeight={isToday ? "$bold" : "$regular"}
                    color={
                      isToday && isCurrentMonth
                        ? "$invert"
                        : isCurrentMonth
                          ? "$primary"
                          : "$secondary"
                    }
                    textAlign="center"
                  >
                    {day}
                  </Text>

                  {/* Bolinha indicadora */}
                  {isCurrentMonth && hasTransactions && (
                    <Tooltip
                      key={dayKey}
                      content={tooltipContent}
                      position="top"
                      inverted
                      arrow={false}
                      offset={0}
                    >
                      <Box
                        position="absolute"
                        bottom="2px"
                        right="2px"
                        width="8px"
                        height="8px"
                        borderRadius="$pill"
                        backgroundColor="$error"
                        boxShadow="$bottom-1"
                      />
                    </Tooltip>
                  )}
                </Box>
              );

              return dayCell;
            },
          )}
        </Box>
      </Card>

      <Loading isLoading={isLoading} />
    </Box>
  );
};

export default MiniCalendar;
