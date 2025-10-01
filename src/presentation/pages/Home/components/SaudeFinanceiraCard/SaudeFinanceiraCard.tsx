import { Box, Card, Text, Title } from "@rarui-react/components";
import React from "react";
import { SaudeFinanceiraCardProps } from "./saudeFinanceiraCard.types";

const SaudeFinanceiraCard: React.FC<SaudeFinanceiraCardProps> = ({
  saudeFinanceira,
  isLoading = false,
  title = "Saúde Financeira",
}) => {
  if (isLoading) {
    return (
      <Card>
        <Card.Body>
          <Box
            padding="$s"
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="160px"
          >
            <Text color="$secondary">Carregando...</Text>
          </Box>
        </Card.Body>
      </Card>
    );
  }

  if (!saudeFinanceira) {
    return (
      <Card>
        <Card.Body>
          <Box padding="$s">
            <Title as="h5" fontSize="$l">
              {title}
            </Title>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="120px"
            >
              <Text color="$secondary">Dados não disponíveis</Text>
            </Box>
          </Box>
        </Card.Body>
      </Card>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "excelente":
        return {
          emoji: "🌟",
          corFundo: "$success",
          corTexto: "$on-success",
          corProgress: "$success",
          titulo: "Excelente",
          descricao: "Suas finanças estão em ótimo estado!",
        };
      case "saudavel":
        return {
          emoji: "✅",
          corFundo: "$success",
          corTexto: "$on-success",
          corProgress: "$success",
          titulo: "Saudável",
          descricao: "Você está no caminho certo!",
        };
      case "atencao":
        return {
          emoji: "⚠️",
          corFundo: "$warning",
          corTexto: "$on-warning",
          corProgress: "$warning",
          titulo: "Atenção",
          descricao: "Alguns pontos precisam de atenção.",
        };
      case "critico":
        return {
          emoji: "🚨",
          corFundo: "$error",
          corTexto: "$on-error",
          corProgress: "$error",
          titulo: "Crítico",
          descricao: "É hora de revisar seus gastos.",
        };
      default:
        return {
          emoji: "📊",
          corFundo: "$secondary",
          corTexto: "$primary",
          corProgress: "$secondary",
          titulo: "Analisando",
          descricao: "Analisando sua situação financeira.",
        };
    }
  };

  const statusInfo = getStatusInfo(saudeFinanceira.status);

  return (
    <Card>
      <Card.Body>
        <Box padding="$s" display="flex" flexDirection="column" gap="$s">
          <Title as="h5" fontSize="$l" color="$primary">
            {statusInfo.emoji} {title}
          </Title>

          {/* Status Principal */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding="$l"
            borderRadius="$lg"
            backgroundColor={statusInfo.corFundo}
          >
            {/* Pontuação Grande */}
            <Box display="flex" alignItems="baseline" gap="$xs">
              <Title
                as="h2"
                fontSize="$xl"
                fontWeight="$bold"
                color={statusInfo.corTexto}
              >
                {saudeFinanceira.pontuacao}
              </Title>
              <Text fontSize="$l" color={statusInfo.corTexto}>
                /100
              </Text>
            </Box>

            <Text fontSize="$l" fontWeight="$bold" color={statusInfo.corTexto}>
              {statusInfo.titulo}
            </Text>

            <Text fontSize="$s" color={statusInfo.corTexto} textAlign="center">
              {statusInfo.descricao}
            </Text>
          </Box>

          {/* Barra de Progresso Customizada */}
          <Box display="flex" flexDirection="column" gap="$xs">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="$xs" color="$secondary">
                Pontuação
              </Text>
              <Text fontSize="$xs" color="$secondary">
                {saudeFinanceira.pontuacao}%
              </Text>
            </Box>

            {/* Barra de progresso customizada com mais impacto */}
            <Box
              width="100%"
              height="12px"
              backgroundColor="$secondary"
              borderRadius="$pill"
              position="relative"
              overflow="hidden"
            >
              <Box
                width={`${saudeFinanceira.pontuacao}%`}
                height="100%"
                backgroundColor={statusInfo.corProgress}
                borderRadius="$pill"
                position="relative"
                style={{
                  transition: "width 0.6s ease-in-out",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {/* Gradiente sutil para dar mais vida à barra */}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  borderRadius="$pill"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Fatores (se disponível) */}
          {saudeFinanceira.fatores &&
            typeof saudeFinanceira.fatores === "object" && (
              <Box display="flex" flexDirection="column" gap="$xs">
                <Text fontSize="$xs" color="$secondary">
                  Fatores analisados:
                </Text>
                <Box display="flex" flexDirection="column" gap="$xs">
                  {Object.entries(saudeFinanceira.fatores).map(
                    ([key, value]) => (
                      <Box
                        key={key}
                        display="flex"
                        alignItems="center"
                        gap="$xs"
                      >
                        <Text fontSize="$xs">{value ? "✅" : "❌"}</Text>
                        <Text fontSize="$xs" color="$secondary">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </Text>
                      </Box>
                    ),
                  )}
                </Box>
              </Box>
            )}
        </Box>
      </Card.Body>
    </Card>
  );
};

export default SaudeFinanceiraCard;
