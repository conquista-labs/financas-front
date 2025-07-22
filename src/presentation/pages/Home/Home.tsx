import React from "react";
import { Box, Card, Title } from "@rarui-react/components";
import { useGetResumoFinanceiro } from "@/presentation/hooks/api";

import { ResumoFinanceiroChart } from "./components";

const Home: React.FC = () => {
  const { data } = useGetResumoFinanceiro();

  const receitas = data?.data.receitasPorMes ?? [];
  const despesas = data?.data.despesasPorMes ?? [];

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$2xs">
      <Title as="h4" color="$primary" fontWeight="$bold">
        Bem vinda, Vivi
      </Title>
      <Box width="650px" height="500px">
        <Card>
          <ResumoFinanceiroChart receitas={receitas} despesas={despesas} />
        </Card>
      </Box>
    </Box>
  );
};

export default Home;
