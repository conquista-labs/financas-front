import { Box, Skeleton, Title } from "@rarui-react/components";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";

import { useTheme } from "@/App";
import { formatMonthAbbr } from "@/presentation/pages/Home/utils";

import { Card } from "../../shared";
import { getChartOptions } from "./evolucaoPatrimonioChart.definitions";
import type { EvolucaoPatrimonioChartProps } from "./evolucaoPatrimonioChart.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const EvolucaoPatrimonioChart: React.FC<EvolucaoPatrimonioChartProps> = ({
  data,
  isLoading,
}) => {
  const { darkMode } = useTheme();

  const chartData = useMemo(() => {
    const labels = data?.data?.series.map((item) =>
      formatMonthAbbr(item.mesReferencia),
    );
    const ativos = data?.data?.series.map((item) => item.totalAtivos);
    const passivos = data?.data?.series.map((item) => item.totalPassivos);
    const liquido = data?.data?.series.map((item) => item.patrimonioLiquido);

    return {
      labels,
      datasets: [
        {
          label: "Ativos",
          data: ativos,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: "Passivos",
          data: passivos,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: "Líquido",
          data: liquido,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true,
          tension: 0.4,
          borderWidth: 3,
        },
      ],
    };
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <Box
          padding="$s"
          display="flex"
          flexDirection="column"
          alignItems="center"
          minHeight="466px"
          gap="$s"
        >
          <Skeleton height="25px" width="50%" />

          <Skeleton height="100%" width="100%" borderRadius="4px" />
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <Box
        display="flex"
        width="100%"
        height="100%"
        maxHeight="400px"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="$s"
        padding="$s"
        minHeight="466px"
      >
        <Title as="h6" color="$secondary">
          📈 Evolução do Patrimônio (últimos 12 meses)
        </Title>
        <Line data={chartData} options={getChartOptions(darkMode)} />
      </Box>
    </Card>
  );
};

export default EvolucaoPatrimonioChart;
