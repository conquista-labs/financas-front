import { ChartOptions } from "chart.js";

export const formatMonth = (mes: string) => {
  // Formata "2025-07" para "07/25"
  const [year, month] = mes.split("-");
  return `${month}/${year.slice(2)}`;
};

export const options = (dark: boolean): ChartOptions<"bar"> => ({
  responsive: true,
  scales: {
    x: {
      stacked: true,
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
      stacked: true,
      ticks: {
        font: {
          family: "Outfit",
        },
        color: dark ? "rgba(242, 242, 243, 1)" : "rgba(24, 26, 27, 1)",
        callback: function (tickValue: string | number) {
          const value =
            typeof tickValue === "number" ? tickValue : parseFloat(tickValue);

          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
          }).format(value);
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
          const value = context.raw as number;
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
          }).format(value);
        },
      },
    },
  },
});
