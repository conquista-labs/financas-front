import React, { useMemo } from "react";
import { Box, Title, Text, Button, Icon } from "@rarui-react/components";
import { RefreshIcon } from "@rarui/icons";
import {
  useGetResumoFinanceiro,
  usePostResumoFinanceiro,
} from "@/presentation/hooks/api";

import { useAuthStore } from "@/presentation/store";
import {
  //  DespesasPorCategoria,
  ResumoMensalTable,
  ResumoFinanceiroChart,
} from "./components";
import { formatCurrency, getLastUpdate } from "./home.definitions";
import { Loading } from "@/presentation/components";

const Home: React.FC = () => {
  const { auth } = useAuthStore();
  const {
    data,
    isLoading: isLoadingGetResumoFinanceiro,
    refetch,
  } = useGetResumoFinanceiro();
  const { mutate, isPending } = usePostResumoFinanceiro();

  const isLoading = useMemo(
    () => isLoadingGetResumoFinanceiro || isPending,
    [isLoadingGetResumoFinanceiro, isPending],
  );

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$2xs">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Title as="h4" color="$secondary" fontWeight="$bold">
          Olá, {auth.nome}
        </Title>
        <Box display="flex" alignItems="center" gap="$2xs">
          <Text fontSize="$s" color="$secondary">
            Última atualização:
            {data?.data.atualizadoEm && getLastUpdate(data?.data.atualizadoEm)}
          </Text>

          <Button
            size="medium"
            variant="text"
            onClick={() => mutate(undefined, { onSuccess: () => refetch() })}
          >
            <Icon source={<RefreshIcon size="medium" />} />
            Atualizar
          </Button>
        </Box>
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
        gridTemplateColumns={{ xs: "1fr", md: "1fr", lg: "1fr 1fr" }}
        gap="$s"
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
          <ResumoFinanceiroChart
            receitas={data?.data.receitasPorMes ?? []}
            despesas={data?.data.despesasPorMes ?? []}
          />
        </Box>

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
          <ResumoMensalTable
            receitas={data?.data.receitasPorMes ?? []}
            despesas={data?.data.despesasPorMes ?? []}
            isLoading={isLoading}
          />
        </Box>
      </Box>
      <Loading isLoading={isLoading} />
    </Box>
  );
};

export default Home;
