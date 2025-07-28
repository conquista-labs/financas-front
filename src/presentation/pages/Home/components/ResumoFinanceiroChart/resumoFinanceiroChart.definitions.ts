import { ChartOptions } from "chart.js";

export const formatMonth = (mes: string) => {
  // Formata "2025-07" para "07/25"
  const [year, month] = mes.split("-");
  return `${month}/${year.slice(2)}`;
};

export const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          family: "Outfit",
        },
        color: "rgba(97, 103, 107, 1)",
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
  scales: {
    x: {
      ticks: {
        font: {
          family: "Outfit",
        },
        maxRotation: 0,
        minRotation: 0,
      },
    },
    y: {
      ticks: {
        font: {
          family: "Outfit",
        },
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
    },
  },
};
