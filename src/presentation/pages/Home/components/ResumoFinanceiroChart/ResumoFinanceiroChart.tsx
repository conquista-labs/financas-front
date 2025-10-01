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
import { useTheme } from "@/App";
import { useIsMobile } from "@/presentation/hooks/core";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const ResumoFinanceiroChart: React.FC<ResumoFinanceiroChartProps> = ({
  receitasMes,
  despesasMes,
  saldosMes,
}) => {
  const labels = despesasMes.map((item) => formatMonth(item.mes));
  const { darkMode } = useTheme();
  const { isMobile } = useIsMobile();

  // Mapeamos os dados de saldos por mês para obter o saldo anterior de cada mês
  const saldoAnteriorData = saldosMes.map((item) =>
    Number(item.saldoMesAnterior),
  );
  const receitasData = receitasMes.map((item) => Number(item.valor));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Receitas do mês",
        data: receitasData,
        backgroundColor: "#96C283",
        borderRadius: 2,
        barThickness: isMobile ? 15 : 20,
        stack: "receitas",
      },
      {
        label: "Saldo mês anterior",
        data: saldoAnteriorData,
        backgroundColor: "#83b4c2ff",
        borderRadius: 2,
        barThickness: isMobile ? 15 : 20,
        stack: "receitas",
      },
      {
        label: "Despesas",
        data: despesasMes.map((item) => Number(item.valor)),
        backgroundColor: "#DB4D4C",
        borderRadius: 2,
        barThickness: isMobile ? 15 : 20,
        stack: "despesas",
      },
    ],
  };

  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      maxHeight="500px"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Title as="h6" color="$secondary">
        Receitas e Despesas
      </Title>
      <Bar data={chartData} options={options(darkMode)} />
    </Box>
  );
};
export default ResumoFinanceiroChart;
