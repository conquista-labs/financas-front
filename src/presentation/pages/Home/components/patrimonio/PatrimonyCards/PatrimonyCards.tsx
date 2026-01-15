import { Box, Card, Skeleton, Text, Title } from "@rarui-react/components";
import { useMemo } from "react";

import {
  formatCurrency,
  formatPercentage,
} from "@/presentation/pages/Home/utils";

import type { PatrimonyCardProps } from "./patrimonyCards.types.ts";

export const PatrimonyCards: React.FC<PatrimonyCardProps> = ({
  data,
  isLoading = false,
  evolucaoData,
  selectedMonth,
  selectedYear,
}) => {
  // Busca dados do mês selecionado na evolução
  const dadosMesSelecionado = useMemo(() => {
    if (!evolucaoData?.series) return null;

    const monthStr = String(selectedMonth).padStart(2, "0");
    const mesReferencia = `${selectedYear}-${monthStr}`;

    return evolucaoData.series.find(
      (item) => item.mesReferencia === mesReferencia,
    );
  }, [evolucaoData, selectedMonth, selectedYear]);

  // Busca o patrimônio líquido de dezembro (direto da API)
  const patrimonioLiquidoDezembro = useMemo(() => {
    if (!evolucaoData?.series) return null;

    // Buscar dados de dezembro na série
    const dadosDezembro = evolucaoData.series.find(
      (item) => item.mesReferencia === `${selectedYear}-12`,
    );

    return dadosDezembro ? dadosDezembro.patrimonioLiquido : null;
  }, [evolucaoData, selectedYear]);

  // Dados a exibir (usa mês selecionado da evolução se disponível, senão usa data do resumo)
  const dadosExibicao = useMemo(() => {
    if (dadosMesSelecionado) {
      return {
        totalAtivos: dadosMesSelecionado.totalAtivos,
        totalPassivos: dadosMesSelecionado.totalPassivos,
        patrimonioLiquido: dadosMesSelecionado.patrimonioLiquido,
      };
    }
    return {
      totalAtivos: data?.totalAtivos ?? 0,
      totalPassivos: data?.totalPassivos ?? 0,
      patrimonioLiquido: data?.patrimonioLiquido ?? 0,
    };
  }, [dadosMesSelecionado, data]);

  // Calcula a categoria dominante de ativos
  const categoriaDominanteAtivos = useMemo(() => {
    if (!data?.distribuicaoAtivos || data.distribuicaoAtivos.length === 0)
      return null;

    const sorted = [...data.distribuicaoAtivos].sort(
      (a, b) => b.valor - a.valor,
    );
    const top = sorted[0];
    const total = data.totalAtivos;
    const percentual = total > 0 ? (top.valor / total) * 100 : 0;

    return {
      categoria: top.categoriaFormatada,
      percentual,
    };
  }, [data]);

  // Calcula a categoria dominante de passivos
  const categoriaDominantePassivos = useMemo(() => {
    if (!data?.distribuicaoPassivos || data.distribuicaoPassivos.length === 0)
      return null;

    const sorted = [...data.distribuicaoPassivos].sort(
      (a, b) => b.valor - a.valor,
    );
    const top = sorted[0];
    const total = data.totalPassivos;
    const percentual = total > 0 ? (top.valor / total) * 100 : 0;

    return {
      categoria: top.categoriaFormatada,
      percentual,
    };
  }, [data]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        gap="$s"
        padding="$s"
        borderRadius="$lg"
        backgroundColor="$background"
        borderWidth="$1"
        borderStyle="solid"
        borderColor="$secondary"
        position="relative"
        className="dashboard-section"
      >
        <Title as="h6" color="$secondary" textAlign="center">
          💼 Patrimônio
        </Title>
        <Box
          display="grid"
          flex="1"
          gridTemplateColumns={{
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap="$s"
        >
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <Box display="flex" flexDirection="column" gap="$xs">
                <Skeleton width="70%" height="16px" />
                <Skeleton width="50%" height="42px" />
                <Skeleton width="60%" height="14px" />
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="$s"
      padding="$s"
      borderRadius="$lg"
      backgroundColor="$background"
      borderWidth="$1"
      borderStyle="solid"
      borderColor="$secondary"
      position="relative"
      className="dashboard-section"
    >
      <Title as="h6" color="$secondary" textAlign="center">
        💼 Patrimônio
      </Title>
      <Box
        display="grid"
        flex="1"
        gridTemplateColumns={{
          xs: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap="$s"
      >
        {/* Ativos */}
        <Card>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
            gap="$2xs"
          >
            <Box
              display="flex"
              alignItems="center"
              gap="$4xs"
              marginBottom="$4xs"
            >
              <Box fontSize="$body-xl">💰</Box>
              <Text
                fontSize="$s"
                fontWeight="$medium"
                color="$secondary"
                lineHeight="$s"
              >
                Ativos
              </Text>
            </Box>
            <Text
              fontSize="$xl"
              fontWeight="$bold"
              lineHeight="$m"
              color="$success"
            >
              {formatCurrency(dadosExibicao.totalAtivos)}
            </Text>

            {/* Evolução dos ativos */}
            {data?.evolucaoAtivos && data.evolucaoAtivos.percentual !== 0 && (
              <Box display="flex" flexDirection="column" gap="$4xs">
                <Text
                  fontSize="$xs"
                  color={
                    data.evolucaoAtivos.percentual > 0
                      ? "$on-success"
                      : "$on-error"
                  }
                >
                  {data.evolucaoAtivos.percentual > 0 ? "↑" : "↓"}{" "}
                  {formatPercentage(Math.abs(data.evolucaoAtivos.percentual))}
                </Text>
                <Text fontSize="$xxs" color="$secondary">
                  {formatCurrency(Math.abs(data.evolucaoAtivos.variacao))} vs
                  mês anterior
                </Text>
              </Box>
            )}

            {/* Saldo disponível */}
            {data?.saldoDisponivel !== undefined && (
              <Text fontSize="$xxs" color="$secondary">
                💰 Saldo em conta: {formatCurrency(data.saldoDisponivel)}
              </Text>
            )}

            {/* Categoria dominante */}
            {categoriaDominanteAtivos && (
              <Text fontSize="$xxs" color="$secondary">
                📊 Principal: {categoriaDominanteAtivos.categoria}{" "}
                {formatPercentage(categoriaDominanteAtivos.percentual, 0)}
              </Text>
            )}
          </Box>
        </Card>

        {/* Passivos */}
        <Card>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
            gap="$2xs"
          >
            <Box
              display="flex"
              alignItems="center"
              gap="$4xs"
              marginBottom="$4xs"
            >
              <Box fontSize="$body-xl">💳</Box>
              <Text
                fontSize="$s"
                fontWeight="$medium"
                color="$secondary"
                lineHeight="$s"
              >
                Passivos
              </Text>
            </Box>

            <Text
              fontSize="$xl"
              fontWeight="$bold"
              lineHeight="$m"
              color="$error"
            >
              {formatCurrency(dadosExibicao.totalPassivos)}
            </Text>

            {/* Evolução dos passivos */}
            {data?.evolucaoPassivos &&
              data.evolucaoPassivos.percentual !== 0 && (
                <Box display="flex" flexDirection="column" gap="$4xs">
                  <Text
                    fontSize="$xs"
                    color={
                      data.evolucaoPassivos.percentual > 0
                        ? "$on-error"
                        : "$on-success"
                    }
                  >
                    {data.evolucaoPassivos.percentual > 0 ? "↑" : "↓"}{" "}
                    {formatPercentage(
                      Math.abs(data.evolucaoPassivos.percentual),
                    )}
                  </Text>
                  <Text fontSize="$xxs" color="$secondary">
                    {formatCurrency(Math.abs(data.evolucaoPassivos.variacao))}{" "}
                    vs mês anterior
                  </Text>
                </Box>
              )}

            {/* Categoria dominante */}
            {categoriaDominantePassivos && (
              <Text fontSize="$xxs" color="$secondary">
                📊 Principal: {categoriaDominantePassivos.categoria}{" "}
                {formatPercentage(categoriaDominantePassivos.percentual, 0)}
              </Text>
            )}
          </Box>
        </Card>

        {/* Líquido */}
        <Card>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
            gap="$2xs"
          >
            <Box
              display="flex"
              alignItems="center"
              gap="$4xs"
              marginBottom="$4xs"
            >
              <Box fontSize="$body-xl">💎</Box>
              <Text
                fontSize="$s"
                fontWeight="$medium"
                color="$secondary"
                lineHeight="$s"
              >
                Líquido
              </Text>
            </Box>

            <Text
              fontSize="$xl"
              fontWeight="$bold"
              lineHeight="$m"
              color="$brand"
            >
              {formatCurrency(dadosExibicao.patrimonioLiquido)}
            </Text>

            {/* Evolução do patrimônio líquido */}
            {data?.evolucao && data.evolucao.percentual !== 0 && (
              <Box display="flex" flexDirection="column" gap="$4xs">
                <Text
                  fontSize="$xs"
                  color={
                    data.evolucao.percentual > 0 ? "$on-success" : "$on-error"
                  }
                >
                  {data.evolucao.percentual > 0 ? "↑" : "↓"}{" "}
                  {formatPercentage(Math.abs(data.evolucao.percentual))}
                </Text>
                <Text fontSize="$xxs" color="$secondary">
                  {formatCurrency(Math.abs(data.evolucao.variacao))} vs mês
                  anterior
                </Text>
              </Box>
            )}

            {/* Fórmula do cálculo */}
            {data?.totalAtivos !== undefined &&
              data?.totalPassivos !== undefined && (
                <Text fontSize="$xxs" color="$secondary">
                  💡 {formatCurrency(dadosExibicao.totalAtivos)} -{" "}
                  {formatCurrency(dadosExibicao.totalPassivos)}
                </Text>
              )}
          </Box>
        </Card>

        {/* Previsão de Dezembro */}
        <Card>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
            gap="$2xs"
          >
            <Box
              display="flex"
              alignItems="center"
              gap="$4xs"
              marginBottom="$4xs"
            >
              <Box fontSize="$body-xl">🔮</Box>
              <Text
                fontSize="$s"
                fontWeight="$medium"
                color="$secondary"
                lineHeight="$s"
              >
                Dezembro/{selectedYear}
              </Text>
            </Box>

            <Text
              fontSize="$xl"
              fontWeight="$bold"
              lineHeight="$m"
              color="$brand"
            >
              {patrimonioLiquidoDezembro
                ? formatCurrency(patrimonioLiquidoDezembro)
                : "—"}
            </Text>

            {/* Variação esperada vs atual */}
            {patrimonioLiquidoDezembro &&
              dadosExibicao.patrimonioLiquido > 0 && (
                <Box display="flex" flexDirection="column" gap="$4xs">
                  <Text
                    fontSize="$xs"
                    color={
                      patrimonioLiquidoDezembro >
                      dadosExibicao.patrimonioLiquido
                        ? "$on-success"
                        : "$on-error"
                    }
                  >
                    {patrimonioLiquidoDezembro > dadosExibicao.patrimonioLiquido
                      ? "↑"
                      : "↓"}{" "}
                    {formatPercentage(
                      Math.abs(
                        ((patrimonioLiquidoDezembro -
                          dadosExibicao.patrimonioLiquido) /
                          dadosExibicao.patrimonioLiquido) *
                          100,
                      ),
                    )}
                  </Text>
                  <Text fontSize="$xxs" color="$secondary">
                    {formatCurrency(
                      Math.abs(
                        patrimonioLiquidoDezembro -
                          dadosExibicao.patrimonioLiquido,
                      ),
                    )}{" "}
                    vs mês atual
                  </Text>
                </Box>
              )}

            <Text fontSize="$xxs" color="$secondary">
              📊 Meta de patrimônio líquido para o final do ano
            </Text>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
