import { Box, Card, Text, Title } from "@rarui-react/components";
import React from "react";
import { MeiosPagamentoChartProps } from "./meiosPagamentoChart.types";
import { formatCurrency } from "@/presentation/pages/Home/home.definitions";
import { ChartSkeleton } from "@/presentation/components";

const MeiosPagamentoChart: React.FC<MeiosPagamentoChartProps> = ({
  meiosPagamento = [],
  formasPagamento,
  resumo,
  isLoading = false,
  title = "Meios de Pagamento",
}) => {
  if (isLoading) {
    return (
      <Card>
        <Card.Body>
          <Box padding="$s" display="flex" flexDirection="column" gap="$s">
            <Title as="h5" fontSize="$l" color="$primary">
              💳 {title}
            </Title>
            <ChartSkeleton type="pie" height="200px" />
          </Box>
        </Card.Body>
      </Card>
    );
  }

  // Cores para os meios de pagamento
  const cores = ["$success", "$info", "$warning", "$error", "$secondary"];

  // Encontrar o valor máximo para normalizar as barras
  const valorMaximo = Math.max(
    ...meiosPagamento.map((meio) => meio.valorTotal),
  );

  return (
    <Card>
      <Box display="flex" flexDirection="column" gap="$s">
        <Title as="h6" color="$secondary" textAlign="center">
          💳 {title}
        </Title>

        {/* Resumo Geral */}
        {resumo && (
          <Box
            padding="$s"
            borderRadius="$lg"
            backgroundColor="$secondary"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Text fontSize="$xs" color="$secondary">
                Total de Transações
              </Text>
              <Text fontSize="$s" color="$primary" fontWeight="$bold">
                {resumo.totalTransacoes || 0}
              </Text>
            </Box>
            <Box>
              <Text fontSize="$xs" color="$secondary">
                Valor Médio
              </Text>
              <Text fontSize="$s" color="$primary" fontWeight="$bold">
                {formatCurrency(resumo.valorMedio || 0)}
              </Text>
            </Box>
            <Box>
              <Text fontSize="$xs" color="$secondary">
                Mais Usado
              </Text>
              <Text fontSize="$s" color="$primary" fontWeight="$bold">
                {resumo.meioMaisUsado || "N/A"}
              </Text>
            </Box>
          </Box>
        )}

        {/* Distribuição por Meio de Pagamento */}
        <Box display="flex" flexDirection="column" gap="$xs">
          <Text fontSize="$xs" color="$secondary" fontWeight="$bold">
            📊 Distribuição por Meio
          </Text>

          {meiosPagamento.map((meio, index) => {
            const porcentagemBarra =
              valorMaximo > 0 ? (meio.valorTotal / valorMaximo) * 100 : 0;
            const cor = cores[index % cores.length];

            return (
              <Box
                key={meio.id}
                display="flex"
                flexDirection="column"
                gap="$xs"
              >
                {/* Header do meio de pagamento */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center" gap="$xs">
                    <Box
                      width="12px"
                      height="12px"
                      backgroundColor={cor}
                      borderRadius="$pill"
                    />
                    <Text fontSize="$xs" color="$primary" fontWeight="$medium">
                      {meio.nome}
                    </Text>
                  </Box>
                  <Box textAlign="right">
                    <Text fontSize="$xs" color="$primary" fontWeight="$bold">
                      {formatCurrency(meio.valorTotal)}
                    </Text>
                    <Text fontSize="$xxs" color="$secondary">
                      {meio.percentualDoTotal?.toFixed(1)}% •{" "}
                      {meio.numeroTransacoes} transações
                    </Text>
                  </Box>
                </Box>

                {/* Barra de progresso */}
                <Box
                  width="100%"
                  height="8px"
                  backgroundColor="$background"
                  borderRadius="$pill"
                  overflow="hidden"
                >
                  <Box
                    width={`${porcentagemBarra}%`}
                    height="100%"
                    backgroundColor={cor}
                    borderRadius="$pill"
                    style={{
                      transition: "width 0.4s ease-in-out",
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Análise À Vista vs Parcelado */}
        {formasPagamento && (
          <Box display="flex" flexDirection="column" gap="$xs">
            <Text fontSize="$xs" color="$secondary" fontWeight="$bold">
              💰 À Vista vs Parcelado
            </Text>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap="$xs">
              {/* À Vista */}
              <Box
                padding="$xs"
                borderRadius="$xs"
                backgroundColor="$success"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Text fontSize="$xs" color="$on-success" fontWeight="$bold">
                  À Vista
                </Text>
                <Text fontSize="$s" color="$on-success" fontWeight="$bold">
                  {formasPagamento.avista?.percentual?.toFixed(0) || 0}%
                </Text>
                <Text fontSize="$xxs" color="$on-success">
                  {formasPagamento.avista?.numeroTransacoes || 0} transações
                </Text>
              </Box>

              {/* Parcelado */}
              <Box
                padding="$xs"
                borderRadius="$xs"
                backgroundColor="$info"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Text fontSize="$xs" color="$on-info" fontWeight="$bold">
                  Parcelado
                </Text>
                <Text fontSize="$s" color="$on-info" fontWeight="$bold">
                  {formasPagamento.parcelado?.percentual?.toFixed(0) || 0}%
                </Text>
                <Text fontSize="$xxs" color="$on-info">
                  {formasPagamento.parcelado?.numeroTransacoes || 0} transações
                </Text>
              </Box>
            </Box>

            {/* Média de parcelamento */}
            {formasPagamento.parcelado?.mediaParcelamento && (
              <Box
                padding="$xs"
                borderRadius="$xs"
                backgroundColor="$background"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$xs" color="$secondary">
                  📊 Média de parcelamento:
                </Text>
                <Text fontSize="$xs" color="$primary" fontWeight="$bold">
                  {formasPagamento.parcelado.mediaParcelamento.toFixed(1)}x
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default MeiosPagamentoChart;
