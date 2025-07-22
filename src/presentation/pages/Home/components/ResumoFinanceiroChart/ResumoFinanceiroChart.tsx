import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ResumoFinanceiroChartProps } from "./resumoFinanceiroChart.types";
import { formatMonth, options } from "./resumoFinanceiroChart.definitions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const ResumoFinanceiroChart: React.FC<ResumoFinanceiroChartProps> = ({
  receitas,
  despesas,
}) => {
  const labels = despesas.map((item) => formatMonth(item.mes));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Receitas",
        data: receitas.map((item) => Number(item.valor)),
        backgroundColor: "#96C283",
        borderColor: "#2E7D32",
        borderRadius: 2,
        barThickness: 25,
      },
      {
        label: "Despesas",
        data: despesas.map((item) => Number(item.valor)),
        backgroundColor: "#DB4D4C",
        borderRadius: 2,
        barThickness: 25,
      },
    ],
  };

  return <Bar data={chartData} options={options} />;
};
export default ResumoFinanceiroChart;
