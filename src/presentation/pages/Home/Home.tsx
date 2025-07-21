import React from "react";
import { Box, Card, Title } from "@rarui-react/components";
import { useGetResumoFinanceiro } from "@/presentation/hooks/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { formatMonth } from "./home.definitions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Home: React.FC = () => {
  const { data } = useGetResumoFinanceiro();

  const receitas = data?.data.receitasPorMes ?? [];
  const despesas = data?.data.despesasPorMes ?? [];

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

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Comfortaa",
            weight: "bold",
          },
          color: "rgba(97, 103, 107, 1)",
        },
      },
      tooltip: {
        titleFont: {
          family: "Comfortaa",
        },
        bodyFont: {
          family: "Comfortaa",
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
            family: "Comfortaa",
            weight: "bold",
          },
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        ticks: {
          font: {
            family: "Comfortaa",
            weight: "bold",
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

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$2xs">
      <Title as="h4" color="$primary" fontWeight="$bold">
        Bem vinda, Vivi
      </Title>
      <Box width="650px" height="500px">
        <Card>
          <Bar data={chartData} options={options} />
        </Card>
      </Box>
    </Box>
  );
};

export default Home;
