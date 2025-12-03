import { Box, Title } from "@rarui-react/components";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";

import { useTheme } from "@/App";
import { formatCurrency } from "@/presentation/pages/Home/utils";

import { Card } from "../../shared";
import { getPieChartOptions } from "./distribuicaoPatrimonioCharts.definitions";
import type { DistribuicaoPatrimonioChartsProps } from "./distribuicaoPatrimonioCharts.types";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

const DistribuicaoPatrimonioCharts: React.FC<
  DistribuicaoPatrimonioChartsProps
> = ({ data, isLoading }) => {
  const { darkMode } = useTheme();

  const ativosChartData = useMemo(() => {
    return {
      labels: data?.data?.distribuicaoAtivos.map(
        (item) => item.categoriaFormatada,
      ),
      datasets: [
        {
          label: "Ativos",
          data: data?.data?.distribuicaoAtivos.map((item) => item.valor),
          backgroundColor: COLORS,
          borderWidth: 2,
          borderColor: darkMode ? "#1f2937" : "#ffffff",
        },
      ],
    };
  }, [data, darkMode]);

  const passivosChartData = useMemo(() => {
    return {
      labels: data?.data.distribuicaoPassivos.map(
        (item) => item.categoriaFormatada,
      ),
      datasets: [
        {
          label: "Passivos",
          data: data?.data.distribuicaoPassivos.map((item) => item.valor),
          backgroundColor: COLORS,
          borderWidth: 2,
          borderColor: darkMode ? "#1f2937" : "#ffffff",
        },
      ],
    };
  }, [data, darkMode]);

  if (isLoading) {
    return (
      <Card>
        <Box padding="$lg" display="flex" justifyContent="center">
          <Title as="h6" color="$secondary">
            Carregando distribuição...
          </Title>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <Box display="flex" flexDirection="column" padding="$s" gap="$s">
        <Title as="h6" color="$secondary" textAlign="center">
          📊 Distribuição do Patrimônio
        </Title>

        <Box display="flex" gap="$s">
          <Box display="flex" flexDirection="column" gap="$2xs">
            <Title as="h6" color="$secondary" textAlign="center">
              💰 Ativos
            </Title>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <Doughnut
                data={ativosChartData}
                options={getPieChartOptions(darkMode, formatCurrency)}
              />
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap="$2xs">
            <Title as="h6" color="$secondary" textAlign="center">
              💳 Passivos
            </Title>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <Doughnut
                data={passivosChartData}
                options={getPieChartOptions(darkMode, formatCurrency)}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default DistribuicaoPatrimonioCharts;
