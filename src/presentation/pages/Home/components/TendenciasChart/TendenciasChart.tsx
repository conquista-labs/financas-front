import { Box, Card, Text, Title } from "@rarui-react/components";
import React from "react";
import { TendenciasChartProps } from "./tendenciasChart.types";
import { formatCurrency } from "@/presentation/pages/Home/home.definitions";

const TendenciasChart: React.FC<TendenciasChartProps> = ({
  evolucaoMensal = [],
  projecaoMesAtual,
  insights = [],
  title = "Tendências Financeiras",
}) => {
  if (!evolucaoMensal || evolucaoMensal.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Box padding="$s">
            <Title as="h5" fontSize="$l" color="$primary">
              {title}
            </Title>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="150px"
            >
              <Text color="$secondary">
                Nenhum dado de tendência disponível
              </Text>
            </Box>
          </Box>
        </Card.Body>
      </Card>
    );
  }

  // Calcular valores máximos para normalizar as barras
  const maxReceita = Math.max(...evolucaoMensal.map((item) => item.receitas));
  const maxDespesa = Math.max(...evolucaoMensal.map((item) => item.despesas));
  const maxValue = Math.max(maxReceita, maxDespesa);

  // Pegar últimos 6 meses para visualização
  const dadosVisuais = evolucaoMensal.slice(-6);

  return (
    <Card>
      <Card.Body>
        <Box padding="$s" display="flex" flexDirection="column" gap="$s">
          <Title as="h5" fontSize="$l" color="$primary">
            📈 {title}
          </Title>

          {/* Projeção do Mês Atual */}
          {projecaoMesAtual && (
            <Box
              padding="$s"
              borderRadius="$lg"
              backgroundColor="$secondary"
              display="flex"
              flexDirection="column"
              gap="$xs"
            >
              <Text fontSize="$xs" color="$primary" fontWeight="$bold">
                🎯 Projeção do Mês
              </Text>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text fontSize="$xs" color="$secondary">
                  Receitas Projetadas:
                </Text>
                <Text fontSize="$xs" color="$success" fontWeight="$bold">
                  {formatCurrency(
                    projecaoMesAtual.valores?.receitasProjetadas || 0,
                  )}
                </Text>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text fontSize="$xs" color="$secondary">
                  Despesas Projetadas:
                </Text>
                <Text fontSize="$xs" color="$error" fontWeight="$bold">
                  {formatCurrency(
                    projecaoMesAtual.valores?.despesasProjetadas || 0,
                  )}
                </Text>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text fontSize="$xs" color="$secondary">
                  Saldo Projetado:
                </Text>
                <Text
                  fontSize="$xs"
                  color={
                    (projecaoMesAtual.valores?.saldoProjetado || 0) >= 0
                      ? "$success"
                      : "$error"
                  }
                  fontWeight="$bold"
                >
                  {formatCurrency(
                    projecaoMesAtual.valores?.saldoProjetado || 0,
                  )}
                </Text>
              </Box>
            </Box>
          )}

          {/* Gráfico de Barras Simples */}
          <Box display="flex" flexDirection="column" gap="$xs">
            <Text fontSize="$xs" color="$secondary" fontWeight="$bold">
              📊 Últimos 6 Meses
            </Text>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="end"
              height="120px"
              gap="$xs"
            >
              {dadosVisuais.map((item, index) => {
                const receitaHeight =
                  maxValue > 0 ? (item.receitas / maxValue) * 100 : 0;
                const despesaHeight =
                  maxValue > 0 ? (item.despesas / maxValue) * 100 : 0;

                return (
                  <Box
                    key={index}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap="$xs"
                    flex="1"
                  >
                    {/* Barras */}
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="end"
                      gap="$4xs"
                      height="80px"
                    >
                      {/* Barra Receitas */}
                      <Box
                        width="8px"
                        height={`${receitaHeight}%`}
                        backgroundColor="$success"
                        borderRadius="$xs"
                        minHeight="4px"
                      />
                      {/* Barra Despesas */}
                      <Box
                        width="8px"
                        height={`${despesaHeight}%`}
                        backgroundColor="$error"
                        borderRadius="$xs"
                        minHeight="4px"
                      />
                    </Box>

                    {/* Mês */}
                    <Text fontSize="$xxs" color="$secondary" textAlign="center">
                      {item.mes.toString().padStart(2, "0")}/{item.ano}
                    </Text>
                  </Box>
                );
              })}
            </Box>

            {/* Legenda */}
            <Box display="flex" justifyContent="center" gap="$s">
              <Box display="flex" alignItems="center" gap="$4xs">
                <Box
                  width="8px"
                  height="8px"
                  backgroundColor="$success"
                  borderRadius="$xs"
                />
                <Text fontSize="$xxs" color="$secondary">
                  Receitas
                </Text>
              </Box>
              <Box display="flex" alignItems="center" gap="$4xs">
                <Box
                  width="8px"
                  height="8px"
                  backgroundColor="$error"
                  borderRadius="$xs"
                />
                <Text fontSize="$xxs" color="$secondary">
                  Despesas
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Insights Automáticos */}
          {insights && insights.length > 0 && (
            <Box display="flex" flexDirection="column" gap="$xs">
              <Text fontSize="$xs" color="$secondary" fontWeight="$bold">
                💡 Insights
              </Text>
              {insights.slice(0, 3).map((insight, index) => (
                <Box
                  key={index}
                  padding="$xs"
                  borderRadius="$xs"
                  backgroundColor="$background"
                  display="flex"
                  alignItems="center"
                  gap="$xs"
                >
                  <Text fontSize="$xs">
                    {insight.tipo === "positivo"
                      ? "✅"
                      : insight.tipo === "atencao"
                        ? "⚠️"
                        : insight.tipo === "critico"
                          ? "🚨"
                          : "💡"}
                  </Text>
                  <Box flex="1">
                    <Text fontSize="$xs" color="$primary" fontWeight="$bold">
                      {insight.titulo}
                    </Text>
                    <Text fontSize="$xxs" color="$secondary">
                      {insight.descricao}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Card.Body>
    </Card>
  );
};

export default TendenciasChart;
