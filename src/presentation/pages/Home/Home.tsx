import React, { useMemo } from "react";
import { Box, Title, Text } from "@rarui-react/components";
import {
  useGetResumoFinanceiro,
  usePostResumoFinanceiro,
} from "@/presentation/hooks/api";

import { useAuthStore } from "@/presentation/store";
import {
  ResumoMensalTable,
  ResumoFinanceiroChart,
  ResumoPorCategoriaTable,
  Card,
  Header,
} from "./components";
import { formatCurrency } from "./home.definitions";
import { Loading } from "@/presentation/components";

const Home: React.FC = () => {
  const { auth } = useAuthStore();
  const { data, isLoading: loadingResumo, refetch } = useGetResumoFinanceiro();
  const { mutate, isPending } = usePostResumoFinanceiro();

  const isLoading = useMemo(
    () => loadingResumo || isPending,
    [loadingResumo, isPending],
  );

  const resumo = data?.data;
  const receitasPorMes = resumo?.receitasPorMes ?? [];
  const despesasPorMes = resumo?.despesasPorMes ?? [];
  const totalReceitas = resumo?.totalReceitasAno ?? 0;
  const totalDespesas = resumo?.totalDespesasAno ?? 0;

  const handleAtualizar = () =>
    mutate(undefined, { onSuccess: () => refetch() });

  if (!resumo && !isLoading) {
    return (
      <Box padding="$md">
        <Text color="$error">Erro ao carregar dados financeiros.</Text>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      gap="$2xs"
      pb="$xl"
    >
      <Header
        nome={auth.nome}
        atualizadoEm={resumo?.atualizadoEm}
        onAtualizar={handleAtualizar}
      />

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap="$s"
      >
        <Card>
          <Text color="$secondary">Total de receitas do ano</Text>
          <Title as="h6" color="$success">
            {formatCurrency(totalReceitas)}
          </Title>
        </Card>
        <Card>
          <Text color="$secondary">Total de despesas do ano</Text>
          <Title as="h6" color="$error">
            {formatCurrency(totalDespesas)}
          </Title>
        </Card>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", lg: "1fr 1fr" }}
        gap="$s"
      >
        <Card>
          <ResumoFinanceiroChart
            receitas={receitasPorMes}
            despesas={despesasPorMes}
          />
        </Card>
        <Card>
          <ResumoMensalTable
            receitas={receitasPorMes}
            despesas={despesasPorMes}
            totalReceitasAno={totalReceitas}
            totalDespesasAno={totalDespesas}
            isLoading={isLoading}
          />
        </Card>
      </Box>
      <Card>
        <ResumoPorCategoriaTable
          despesasCategoriasAno={resumo?.despesasPorCategoria ?? []}
          despesasCategoriasMes={resumo?.despesasPorCategoriaPorMes ?? []}
          isLoading={isLoading}
        />
      </Card>

      <Loading isLoading={isLoading} />
    </Box>
  );
};

export default Home;
