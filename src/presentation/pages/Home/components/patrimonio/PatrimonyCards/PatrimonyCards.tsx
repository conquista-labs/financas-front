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
}) => {
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
            lg: "repeat(3, 1fr)",
          }}
          gap="$s"
        >
          {[1, 2, 3].map((i) => (
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
          lg: "repeat(3, 1fr)",
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
              {formatCurrency(data?.totalAtivos ?? 0)}
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
              {formatCurrency(data?.totalPassivos ?? 0)}
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
              {formatCurrency(data?.patrimonioLiquido ?? 0)}
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
                  💡 {formatCurrency(data.totalAtivos)} -{" "}
                  {formatCurrency(data.totalPassivos)}
                </Text>
              )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
