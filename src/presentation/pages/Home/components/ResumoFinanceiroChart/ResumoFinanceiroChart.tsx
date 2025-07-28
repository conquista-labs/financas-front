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
import { Box, Title } from "@rarui-react/components";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const ResumoFinanceiroChart: React.FC<ResumoFinanceiroChartProps> = ({
  receitasMes,
  despesasMes,
}) => {
  const labels = despesasMes.map((item) => formatMonth(item.mes));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Receitas",
        data: receitasMes.map((item) => Number(item.valor)),
        backgroundColor: "#96C283",
        borderRadius: 2,
        barThickness: 20,
      },
      {
        label: "Despesas",
        data: despesasMes.map((item) => Number(item.valor)),
        backgroundColor: "#DB4D4C",
        borderRadius: 2,
        barThickness: 20,
      },
    ],
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      height="100%"
      flexDirection="column"
    >
      <Title as="h6" color="$secondary">
        Receitas e Despesas
      </Title>
      <Bar data={chartData} options={options} />
    </Box>
  );
};
export default ResumoFinanceiroChart;
