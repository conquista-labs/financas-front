import { Box } from "@rarui-react/components";
import React, { useMemo } from "react";

import {
  useGetEvolucaoPatrimonio,
  useGetResumoPatrimonio,
} from "@/presentation/hooks/api";

import {
  DistribuicaoPatrimonioCharts,
  EvolucaoPatrimonioChart,
  PatrimonyCards,
} from "../../patrimonio";
import type { PatrimonioTabProps } from "./patrimonioTab.types";

const PatrimonioTab: React.FC<PatrimonioTabProps> = ({ year, month }) => {
  // Calcula datas para o ano selecionado (Janeiro a Dezembro)
  const { dataInicio, dataFim } = useMemo(() => {
    return {
      dataInicio: `${year}-01-01`,
      dataFim: `${year}-12-31`,
    };
  }, [year]);

  // Resumo Patrimonial - carrega apenas quando a tab é acessada
  const { data: resumoPatrimonioData, isLoading: loadingResumo } =
    useGetResumoPatrimonio(undefined, {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    });

  // Evolução do Patrimônio (últimos 12 meses)
  const { data: evolucaoData, isLoading: loadingEvolucao } =
    useGetEvolucaoPatrimonio(
      { dataInicio, dataFim, granularidade: "mensal" },
      {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    );

  return (
    <Box display="flex" flexDirection="column" gap="$s" pt="$s">
      {/* Cards de Resumo */}

      <PatrimonyCards
        data={resumoPatrimonioData?.data}
        isLoading={loadingResumo}
        evolucaoData={evolucaoData?.data}
        selectedMonth={month}
        selectedYear={year}
      />

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          md: "1fr",
          xl: "2fr 1fr",
        }}
        gap="$s"
        padding="$s"
        borderRadius="$lg"
        backgroundColor="$background"
        borderWidth="$1"
        borderStyle="solid"
        borderColor="$secondary"
        width="100%"
      >
        {/* Gráfico de Evolução */}
        <EvolucaoPatrimonioChart
          data={evolucaoData}
          isLoading={loadingEvolucao}
        />
        {/* Gráficos de Distribuição */}
        <DistribuicaoPatrimonioCharts
          data={resumoPatrimonioData}
          isLoading={loadingResumo}
        />
      </Box>
    </Box>
  );
};

export default PatrimonioTab;
