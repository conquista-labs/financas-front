import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ResumoFinanceiroChartProps } from "./despesasPorCategoria.types";
import { options } from "./despesasPorCategoria.definitions";
import { ChartSkeleton } from "@/presentation/components";

ChartJS.register(ArcElement, Tooltip, Legend);

export const DespesasPorCategoria: React.FC<ResumoFinanceiroChartProps> = ({
  despesas,
  isLoading = false,
}) => {
  const chartData = useMemo(() => {
    const labels = despesas.map((item) => item.categoria);
    const values = despesas.map((item) => item.valor);
    const backgroundColors = despesas.map((item) => item.cor);

    return {
      labels,
      datasets: [
        {
          label: "Despesas por categoria (ano)",
          data: values,
          backgroundColor: backgroundColors,
          borderWidth: 0,
        },
      ],
    };
  }, [despesas]);

  if (isLoading) {
    return <ChartSkeleton type="pie" height="300px" />;
  }

  return <Pie data={chartData} options={options} />;
};

export default DespesasPorCategoria;
