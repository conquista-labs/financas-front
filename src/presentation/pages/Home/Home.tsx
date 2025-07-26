import React from "react";
import {
  Box,
  // Divider,
  Title,
  Text,
  Button,
  Icon,
} from "@rarui-react/components";
import { RefreshIcon } from "@rarui/icons";
import { useGetResumoFinanceiro } from "@/presentation/hooks/api";

import { useAuthStore } from "@/presentation/store";
import {
  //  DespesasPorCategoria,
  ResumoFinanceiroChart,
} from "./components";
import { formatCurrency } from "./home.definitions";

const Home: React.FC = () => {
  const { auth } = useAuthStore();
  const { data } = useGetResumoFinanceiro();

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$2xs">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Title as="h4" color="$secondary" fontWeight="$bold">
          Olá, {auth.nome}
        </Title>
        <Button size="medium" variant="text">
          <Icon source={<RefreshIcon size="medium" />} />
          Atualizar
        </Button>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap="$s"
      >
        <Box
          flex="1"
          backgroundColor="$primary"
          borderRadius="$xs"
          borderWidth="$1"
          borderStyle="solid"
          borderColor="$subdued"
          padding="$s"
          display="flex"
          flexDirection="column"
          gap="$3xs"
          boxSizing="border-box"
        >
          <Text color="$secondary">Total de receitas do ano</Text>
          <Title as="h6" color="$success">
            {formatCurrency(data?.data.totalReceitasAno ?? 0)}
          </Title>
        </Box>
        <Box
          flex="1"
          backgroundColor="$primary"
          borderRadius="$xs"
          borderWidth="$1"
          borderStyle="solid"
          borderColor="$subdued"
          padding="$s"
          display="flex"
          flexDirection="column"
          gap="$3xs"
        >
          <Text color="$secondary">Total de despesas do ano</Text>
          <Title as="h6" color="$error">
            {formatCurrency(data?.data.totalDespesasAno ?? 0)}
          </Title>
        </Box>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap="$s"
        gridTemplateRows="500px"
      >
        <Box
          flex="1"
          backgroundColor="$primary"
          borderRadius="$xs"
          borderWidth="$1"
          borderStyle="solid"
          borderColor="$subdued"
          padding="$xs"
          display="flex"
          flexDirection="column"
          gap="$2xs"
        >
          {/* <Title as="h6" color="$secondary">
            Despesas e receitas mensal
          </Title>
          <Divider /> */}
          <ResumoFinanceiroChart
            receitas={data?.data.receitasPorMes ?? []}
            despesas={data?.data.despesasPorMes ?? []}
          />
        </Box>

        {/* <Box
          flex="1"
          backgroundColor="$primary"
          borderRadius="$xs"
          borderWidth="$1"
          borderStyle="solid"
          borderColor="$subdued"
          padding="$xs"
          display="flex"
          flexDirection="column"
          gap="$2xs"
        >
          <Title as="h6" color="$secondary">
            Despesa anual por catégoria
          </Title>
          <Divider />
          <DespesasPorCategoria
            despesas={data?.data.despesasPorCategoria ?? []}
          />
        </Box> */}
      </Box>
    </Box>
  );
};

export default Home;
