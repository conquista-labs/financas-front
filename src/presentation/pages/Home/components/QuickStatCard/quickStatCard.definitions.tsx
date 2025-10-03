import {
  CalendarDateRangeOutlinedIcon,
  CalendarEventOutlinedIcon,
  MoneyOutlinedIcon,
  CreditCardOutlinedIcon,
  TagOutlinedIcon,
  ChartBarsOutlinedIcon,
} from "@rarui/icons";

export const getVariacaoColor = (tipo: string) => {
  switch (tipo) {
    case "positiva":
      return "$success";
    case "negativa":
      return "$error";
    default:
      return "$warning";
  }
};

export const getVariacaoIcon = (tipo: string) => {
  switch (tipo) {
    case "positiva":
      return "↗️";
    case "negativa":
      return "↘️";
    default:
      return "→";
  }
};

export const icons = {
  "calendar-week": <CalendarDateRangeOutlinedIcon size="medium" />,
  "calendar-check": <CalendarEventOutlinedIcon size="medium" />,
  "piggy-bank": <MoneyOutlinedIcon size="medium" />,
  receipt: <CreditCardOutlinedIcon size="medium" />,
  category: <TagOutlinedIcon size="medium" />,
  "chart-line": <ChartBarsOutlinedIcon size="medium" />,
} as const;
