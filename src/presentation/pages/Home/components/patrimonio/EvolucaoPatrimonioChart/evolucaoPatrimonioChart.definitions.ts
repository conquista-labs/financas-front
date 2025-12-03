import type { ChartOptions } from "chart.js";

import { formatCurrency } from "@/presentation/pages/Home/utils";

export const getChartOptions = (dark: boolean): ChartOptions<"line"> => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        font: {
          family: "Outfit",
        },
        color: dark ? "rgba(242, 242, 243, 1)" : "rgba(24, 26, 27, 1)",
        maxRotation: 0,
        minRotation: 0,
      },
      grid: {
        color: dark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)",
      },
    },
    y: {
      ticks: {
        font: {
          family: "Outfit",
        },
        color: dark ? "rgba(242, 242, 243, 1)" : "rgba(24, 26, 27, 1)",
        callback: function (tickValue: string | number) {
          const value =
            typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
          return formatCurrency(value);
        },
      },
      grid: {
        color: dark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          family: "Outfit",
        },
        color: dark ? "rgba(242, 242, 243, 1)" : "rgba(24, 26, 27, 1)",
      },
    },
    tooltip: {
      titleFont: {
        family: "Outfit",
      },
      bodyFont: {
        family: "Outfit",
      },
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || "";
          const value = context.raw as number;
          return `${label}: ${formatCurrency(value)}`;
        },
      },
    },
  },
});
