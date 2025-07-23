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
  const filterDespesas = despesas.filter((despesa) =>
    despesa.mes.includes("2025"),
  );
  const filterReceitas = receitas.filter((receita) =>
    receita.mes.includes("2025"),
  );
  const labels = filterDespesas.map((item) => formatMonth(item.mes));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Receitas",
        data: filterReceitas.map((item) => Number(item.valor)),
        backgroundColor: "#96C283",
        borderRadius: 2,
        barThickness: 20,
      },
      {
        label: "Despesas",
        data: filterDespesas.map((item) => Number(item.valor)),
        backgroundColor: "#DB4D4C",
        borderRadius: 2,
        barThickness: 20,
      },
    ],
  };

  return <Bar data={chartData} options={options} />;
};
export default ResumoFinanceiroChart;
