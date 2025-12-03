import { Box, Card, Divider, Text, Title } from "@rarui-react/components";

import type { AnalyticsPadroesTemporaisDataDto } from "@/domain/models";
import { formatCurrency } from "@/presentation/pages/Home/home.definitions";

interface PadroesTemporaisCardProps {
  data?: AnalyticsPadroesTemporaisDataDto;
  isLoading?: boolean;
}

const getDiaSemanaEmoji = (diaSemana: string) => {
  const emojiMap: Record<string, string> = {
    segunda: "📊",
    terca: "📈",
    quarta: "💰",
    quinta: "📉",
    sexta: "💳",
    sabado: "🛍️",
    domingo: "🏠",
  };
  return emojiMap[diaSemana.toLowerCase()] || "📅";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pendente":
      return "$warning";
    case "atrasado":
      return "$error";
    case "realizado":
      return "$success";
    default:
      return "$secondary";
  }
};

export const PadroesTemporaisCard = ({
  data,
  isLoading = false,
}: PadroesTemporaisCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <Box display="flex" flexDirection="column" gap="$s">
          <Box
            height="24px"
            backgroundColor="$secondary"
            borderRadius="$xs"
            width="70%"
          />
          <Box display="flex" flexDirection="column" gap="$xs">
            {Array.from({ length: 6 }).map((_, index) => (
              <Box
                key={index}
                height="16px"
                backgroundColor="$secondary"
                borderRadius="$xs"
                width={`${60 + index * 10}%`}
              />
            ))}
          </Box>
        </Box>
      </Card>
    );
  }

  if (!data) {
    return (
      <Box
        borderWidth="$1"
        borderStyle="solid"
        borderColor="$divider"
        borderRadius="$lg"
        minHeight="400px"
      >
        <Card backgroundColor="$background" padding="base">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Text fontSize="$l" color="$secondary">
              📅
            </Text>
            <Text fontSize="$s" color="$secondary" textAlign="center">
              Dados de padrões temporais não disponíveis
            </Text>
          </Box>
        </Card>
      </Box>
    );
  }

  const topDiaSemana = (data.padroesDiarios ?? []).sort(
    (a, b) => b.valorTotal - a.valorTotal,
  )[0];

  const transacoesRecorrentesTop = (data.transacoesRecorrentes ?? [])
    .sort((a, b) => b.valorMedio - a.valorMedio)
    .slice(0, 3);

  const lembretesProximos = (data.lembretes ?? [])
    .filter((l) => l.status === "pendente" || l.status === "atrasado")
    .slice(0, 3);

  const parcelasProximas = (data.parcelasAbertas ?? [])
    .sort((a, b) => a.parcelasRestantes - b.parcelasRestantes)
    .slice(0, 3);

  return (
    <Card padding="base">
      <Box display="flex" flexDirection="column" gap="$s" height="100%">
        {/* Header */}

        <Title as="h6" color="$secondary" textAlign="center">
          📅 Padrões Temporais
        </Title>

        {/* Conteúdo Principal */}
        <Box display="flex" flexDirection="column" gap="$s" flex="1">
          {/* Dia da semana com mais gastos */}
          {topDiaSemana && (
            <Box display="flex" flexDirection="column" gap="$3xs">
              <Text fontSize="$m" color="$secondary" fontWeight="$semiBold">
                Dia com mais gastos
              </Text>
              <Box display="flex" alignItems="center" gap="$4xs">
                <Text fontSize="$s">
                  {getDiaSemanaEmoji(topDiaSemana.diaSemana)}
                </Text>
                <Text fontSize="$s" fontWeight="$medium" color="$primary">
                  {topDiaSemana.diaSemana.charAt(0).toUpperCase() +
                    topDiaSemana.diaSemana.slice(1)}
                </Text>
                <Text fontSize="$xs" color="$success" fontWeight="$semiBold">
                  {formatCurrency(topDiaSemana.valorTotal)}
                </Text>
              </Box>
              <Text fontSize="$xs" color="$secondary">
                {topDiaSemana.numeroTransacoes} transações •{" "}
                {topDiaSemana.horarioPreferido}
              </Text>
            </Box>
          )}
          <Divider />
          {/* Transações Recorrentes */}
          {transacoesRecorrentesTop.length > 0 && (
            <Box display="flex" flexDirection="column" gap="$4xs">
              <Text fontSize="$m" fontWeight="$medium" color="$secondary">
                Recorrências ({data.transacoesRecorrentes.length})
              </Text>
              <Box display="flex" flexDirection="column" gap="$2xs">
                {transacoesRecorrentesTop.map((recorrente, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box flex="1">
                      <Text fontSize="$xs" color="$primary" lineHeight="$xs">
                        {recorrente.padrao.slice(0, 25)}...
                      </Text>
                      <Text fontSize="$xs" color="$secondary">
                        {recorrente.frequencia} • {recorrente.confianca}%
                        confiança
                      </Text>
                    </Box>
                    <Text
                      fontSize="$xs"
                      color="$success"
                      fontWeight="$semiBold"
                    >
                      {formatCurrency(recorrente.valorMedio)}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          <Divider />
          {/* Lembretes e Parcelas */}
          {(lembretesProximos.length > 0 || parcelasProximas.length > 0) && (
            <Box display="flex" flexDirection="column" gap="$4xs">
              <Text fontSize="$m" fontWeight="$medium" color="$secondary">
                Pendências
              </Text>

              {/* Lembretes */}
              {lembretesProximos.map((lembrete, index) => (
                <Box
                  key={`lembrete-${index}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb="$3xs"
                >
                  <Box flex="1">
                    <Text fontSize="$xs" color="$primary" lineHeight="$xs">
                      {lembrete.descricao.slice(0, 20)}...
                    </Text>
                    <Text
                      fontSize="$xs"
                      color={getStatusColor(lembrete.status)}
                    >
                      {lembrete.status.toUpperCase()}
                    </Text>
                  </Box>
                  <Text fontSize="$xs" color="$error" fontWeight="$semiBold">
                    {formatCurrency(lembrete.valor)}
                  </Text>
                </Box>
              ))}

              {/* Parcelas */}
              {parcelasProximas.map((parcela, index) => (
                <Box
                  key={`parcela-${index}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb="$3xs"
                >
                  <Box flex="1">
                    <Text fontSize="$xs" color="$primary" lineHeight="$xs">
                      {parcela.descricao.slice(0, 20)}...
                    </Text>
                    <Text fontSize="$xs" color="$warning">
                      {parcela.parcelaAtual}/{parcela.totalParcelas} •{" "}
                      {parcela.parcelasRestantes} restantes
                    </Text>
                  </Box>
                  <Text fontSize="$xs" color="$warning" fontWeight="$semiBold">
                    {formatCurrency(parcela.valorParcela)}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Footer com resumo */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingTop="$xs"
          borderTopWidth="$1"
          borderStyle="solid"
          borderColor="$divider"
        >
          <Text fontSize="$xs" color="$secondary">
            {(data.padroesDiarios ?? []).length} padrões •{" "}
            {(data.transacoesRecorrentes ?? []).length} recorrências
          </Text>
          <Text fontSize="$xs" color="$secondary">
            {(data.lembretes ?? []).length +
              (data.parcelasAbertas ?? []).length}{" "}
            pendências
          </Text>
        </Box>
      </Box>
    </Card>
  );
};
