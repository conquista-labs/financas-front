import { Box } from "@rarui-react/components";
import React, { useMemo } from "react";

import {
  useGetAnalyticsMeiosPagamento,
  useGetResumoFinanceiro,
} from "@/presentation/hooks/api";

import { Card } from "../../shared";
import { MeiosPagamentoChart } from "../../analytics";
import { ResumoPorCategoriaTable } from "../../categorias";
import type { AnalisesDetalhadasTabProps } from "./AnalisesDetalhadasTab.types";

const AnalisesDetalhadasTab: React.FC<AnalisesDetalhadasTabProps> = ({
  year,
  month,
}) => {
  // Resumo Financeiro - necessário para despesas por categoria
  const { data: resumoData } = useGetResumoFinanceiro(
    { ano: year },
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  );

  // Analytics de Meios de Pagamento
  const {
    data: analyticsMeiosPagamentoData,
    isLoading: loadingAnalyticsMeiosPagamento,
  } = useGetAnalyticsMeiosPagamento(
    {
      ano: year,
      mes: month,
    },
    {
      staleTime: 3 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  );

  const { despesasPorCategoriaAno, despesasPorCategoriaMes } = useMemo(
    () => ({
      despesasPorCategoriaAno: resumoData?.data?.despesasPorCategoriaAno ?? [],
      despesasPorCategoriaMes: resumoData?.data?.despesasPorCategoriaMes ?? [],
    }),
    [resumoData],
  );

  return (
    <Box display="flex" flexDirection="column" gap="$s" pt="$s">
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          md: "1fr",
          xl: "3fr 1fr",
        }}
        gap="$s"
        padding="$s"
        borderRadius="$lg"
        backgroundColor="$background"
        borderWidth="$1"
        borderStyle="solid"
        borderColor="$secondary"
      >
        <Card>
          <ResumoPorCategoriaTable
            despesasPorCategoriaAno={despesasPorCategoriaAno}
            despesasPorCategoriaMes={despesasPorCategoriaMes}
          />
        </Card>
        <MeiosPagamentoChart
          meiosPagamento={analyticsMeiosPagamentoData?.data?.meiosPagamento}
          formasPagamento={analyticsMeiosPagamentoData?.data?.formasPagamento}
          resumo={analyticsMeiosPagamentoData?.data?.resumo}
          isLoading={loadingAnalyticsMeiosPagamento}
          title="Meios de Pagamento"
        />
      </Box>
    </Box>
  );
};

export default AnalisesDetalhadasTab;
