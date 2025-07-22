import { ChartOptions } from "chart.js";

export const options: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
      labels: {
        font: {
          family: "Outfit",
        },
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
        label: (context: any) => {
          const data = context.chart.data.datasets[0].data as number[];
          const total = data.reduce((acc, curr) => acc + curr, 0);
          const value = context.raw;
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${percentage}% (R$ ${value})`;
        },
      },
    },
  },
};
