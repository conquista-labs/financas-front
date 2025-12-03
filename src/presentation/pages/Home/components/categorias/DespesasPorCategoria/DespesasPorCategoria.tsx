import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";

import { options } from "./despesasPorCategoria.definitions";
import type { ResumoFinanceiroChartProps } from "./despesasPorCategoria.types";

ChartJS.register(ArcElement, Tooltip, Legend);

export const DespesasPorCategoria: React.FC<ResumoFinanceiroChartProps> = ({
  despesas,
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

  return <Pie data={chartData} options={options} />;
};

export default DespesasPorCategoria;
