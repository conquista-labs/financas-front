import { Box, Card, Text, Title } from "@rarui-react/components";
import React from "react";
import { SaudeFinanceiraCardProps } from "./saudeFinanceiraCard.types";
import { getStatusInfo } from "./saudeFinanceiraCard.definitions";

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

  const statusInfo = getStatusInfo(saudeFinanceira?.status ?? "");

  return (
    <Card>
      <Box display="flex" flexDirection="column" gap="$s">
        <Title as="h6" color="$secondary" textAlign="center">
          {statusInfo.emoji} {title}
        </Title>

        {/* Status Principal */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding="$2xs"
          borderRadius="$xs"
          backgroundColor={statusInfo.corFundo}
        >
          {/* Pontuação Grande */}
          <Box display="flex" alignItems="baseline" gap="$4xs">
            <Title
              as="h2"
              fontSize="$xl"
              fontWeight="$bold"
              color={statusInfo.corTexto}
            >
              {saudeFinanceira?.pontuacao ?? 0}
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
        <Box display="flex" flexDirection="column" gap="$3xs" my="$2xs">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="$xs" color="$secondary">
              Pontuação
            </Text>
            <Text fontSize="$xs" color="$secondary">
              {saudeFinanceira?.pontuacao ?? 0}%
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
              width={`${saudeFinanceira?.pontuacao ?? 0}%`}
              height="100%"
              backgroundColor={statusInfo.corProgress}
              borderRadius="$pill"
              position="relative"
              transitionProperty="all"
              //@ts-ignore
              transitionDuration="0.6s"
              transitionTimingFunction="ease-in-out"
              boxShadow="$bottom-4"
            />
          </Box>
        </Box>

        {/* Fatores (se disponível) */}
        {saudeFinanceira?.fatores &&
          typeof saudeFinanceira.fatores === "object" && (
            <Box display="flex" flexDirection="column" gap="$xs">
              <Text fontSize="$m" color="$secondary" fontWeight="$semiBold">
                Fatores analisados:
              </Text>
              <Box display="flex" flexDirection="column" gap="$3xs">
                {Object.entries(saudeFinanceira.fatores).map(([key, value]) => (
                  <Box key={key} display="flex" alignItems="center" gap="$4xs">
                    <Text fontSize="$xs">{value ? "✅" : "❌"}</Text>
                    <Text fontSize="$xs" color="$secondary">
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
      </Box>
    </Card>
  );
};

export default SaudeFinanceiraCard;
