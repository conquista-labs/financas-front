import type { ChartOptions } from "chart.js";

export const getPieChartOptions = (
  dark: boolean,
  formatCurrency: (value: number) => string,
): ChartOptions<"doughnut"> => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          family: "Outfit",
        },
        color: dark ? "rgba(242, 242, 243, 1)" : "rgba(24, 26, 27, 1)",
        padding: 15,
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
          const label = context.label || "";
          const value = context.raw as number;
          const total = context.dataset.data.reduce(
            (acc: number, curr) => acc + (curr as number),
            0,
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${formatCurrency(value)} (${percentage}%)`;
        },
      },
    },
  },
});
