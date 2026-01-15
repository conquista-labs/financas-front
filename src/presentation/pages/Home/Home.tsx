import { ArrowLeftIcon, ArrowRightIcon } from "@rarui/icons";
import { Box, Datepicker, IconButton, Tabs } from "@rarui-react/components";
import { addYears, format, getMonth, getYear, subYears } from "date-fns";
import React, { useState } from "react";
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";

import { Loading } from "@/presentation/components";
import { useAuthStore } from "@/presentation/store";

import {
  AnalisesDetalhadasTab,
  Header,
  PatrimonioTab,
  VisaoGeralTab,
} from "./components";
import { useHomeData } from "./hooks";

const Home: React.FC = () => {
  const [params, setParams] = useQueryParams({
    year: withDefault(StringParam, format(new Date(), "yyyy")),
    month: withDefault(StringParam, format(new Date(), "MM")),
    tab: withDefault(NumberParam, 0),
  });

  const { auth } = useAuthStore();

  // Estado para navegação do mini calendário
  const [miniCalendarMonth, setMiniCalendarMonth] = useState(
    getMonth(new Date()) + 1,
  );
  const [miniCalendarYear, setMiniCalendarYear] = useState(Number(params.year));

  // Hook simplificado - apenas para o Header e controle de refresh
  const { isLoading, handleRefreshData } = useHomeData({
    year: Number(params.year),
  });

  const navigateYear = (direction: "prev" | "next") => {
    const operator = direction === "next" ? addYears : subYears;
    const date = new Date(Number(params.year), 0);
    const newYear = format(operator(date!, 1), "yyyy");
    setParams({ year: newYear });
  };

  const handleDateChange = (date: Date) => {
    setParams({ year: format(date, "yyyy"), month: format(date, "MM") });
    setMiniCalendarYear(getYear(date));
  };

  const handleMiniCalendarNavigate = (month: number, year: number) => {
    setMiniCalendarMonth(month);
    setMiniCalendarYear(year);
  };

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$s" pb="$xl">
      {/* 🎯 SEÇÃO 1: Header + Controles (FORA DAS TABS) */}
      <Box display="flex" flexDirection="column" gap="$s">
        <Header
          nome={auth.user.nome ?? ""}
          atualizadoEm={undefined}
          onAtualizar={handleRefreshData}
        />

        <Box display="flex" justifyContent="flex-end">
          <Box
            display="flex"
            alignItems="center"
            gap="$2xs"
            width={{ xs: "100%", md: "300px" }}
          >
            <IconButton
              source={<ArrowLeftIcon size="medium" />}
              onClick={() => navigateYear("prev")}
            />
            <Datepicker
              dateFormat="MM/yyyy"
              showMonthYearPicker
              selected={new Date(Number(params.year), Number(params.month) - 1)}
              onChange={(date) => handleDateChange(date as Date)}
            />
            <IconButton
              source={<ArrowRightIcon size="medium" />}
              onClick={() => navigateYear("next")}
            />
          </Box>
        </Box>
      </Box>

      <Tabs
        position="left"
        underlined
        selectedTab={params.tab}
        preSelectedTab={params.tab}
      >
        <Tabs.Item label="📊 Visão Geral" onClick={() => setParams({ tab: 0 })}>
          <VisaoGeralTab
            year={Number(params.year)}
            month={Number(params.month)}
            miniCalendarMonth={miniCalendarMonth}
            miniCalendarYear={miniCalendarYear}
            onNavigateMiniCalendar={handleMiniCalendarNavigate}
          />
        </Tabs.Item>

        <Tabs.Item label="💰 Patrimônio" onClick={() => setParams({ tab: 1 })}>
          <PatrimonioTab
            year={Number(params.year)}
            month={Number(params.month)}
          />
        </Tabs.Item>

        <Tabs.Item
          label="📈 Análises Detalhadas"
          onClick={() => setParams({ tab: 2 })}
        >
          <AnalisesDetalhadasTab
            year={Number(params.year)}
            month={Number(params.month)}
          />
        </Tabs.Item>
      </Tabs>

      <Loading isLoading={isLoading} />
    </Box>
  );
};

export default Home;
