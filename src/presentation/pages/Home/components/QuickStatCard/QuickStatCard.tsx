import { Box, Card, Icon, Text } from "@rarui-react/components";
import { QuickStatDto } from "@/domain/models";
import { formatCurrency } from "@/presentation/pages/Home/home.definitions";

interface QuickStatCardProps {
  data: QuickStatDto;
  isLoading?: boolean;
}

const getVariacaoColor = (tipo: string) => {
  switch (tipo) {
    case "positiva":
      return "$success";
    case "negativa":
      return "$error";
    default:
      return "$warning";
  }
};

const getVariacaoIcon = (tipo: string) => {
  switch (tipo) {
    case "positiva":
      return "↗️";
    case "negativa":
      return "↘️";
    default:
      return "→";
  }
};

const formatValue = (value: string | number): string => {
  if (typeof value === "number") {
    return formatCurrency(value);
  }

  // Se é string, verifica se pode ser convertida em número para formatação
  const numValue = parseFloat(
    value
      .toString()
      .replace(/[^\d.,]/g, "")
      .replace(",", "."),
  );
  if (!isNaN(numValue)) {
    return formatCurrency(numValue);
  }

  return value.toString();
};

export const QuickStatCard = ({
  data,
  isLoading = false,
}: QuickStatCardProps) => {
  if (isLoading) {
    return (
      <Card
        borderColor="$secondary"
        backgroundColor="$background"
        padding="$m"
        minHeight="120px"
      >
        <Box display="flex" flexDirection="column" gap="$xs">
          <Box
            height="16px"
            backgroundColor="$surface"
            borderRadius="$xs"
            width="70%"
          />
          <Box
            height="24px"
            backgroundColor="$surface"
            borderRadius="$xs"
            width="50%"
          />
          <Box
            height="14px"
            backgroundColor="$surface"
            borderRadius="$xs"
            width="60%"
          />
        </Box>
      </Card>
    );
  }

  return (
    <Card
      borderColor="$secondary"
      backgroundColor="$background"
      padding="$m"
      minHeight="120px"
      _hover={{
        borderColor: "$primary",
        transform: "translateY(-2px)",
        transition: "all 0.2s ease",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        {/* Header com ícone e título */}
        <Box display="flex" alignItems="center" gap="$xs" marginBottom="$xs">
          {data.icone && <Text fontSize="$m">{data.icone}</Text>}
          <Text
            fontSize="$s"
            fontWeight="$medium"
            color="$secondary"
            lineHeight="$s"
          >
            {data.titulo}
          </Text>
        </Box>

        {/* Valor principal */}
        <Box marginBottom="$xs">
          <Text
            fontSize="$xl"
            fontWeight="$bold"
            color="$primary"
            lineHeight="$m"
          >
            {formatValue(data.valor)}
          </Text>
        </Box>

        {/* Footer com subtítulo e variação */}
        <Box display="flex" flexDirection="column" gap="$xxs">
          {data.subtitulo && (
            <Text fontSize="$xs" color="$tertiary" lineHeight="$xs">
              {data.subtitulo}
            </Text>
          )}

          {data.variacao && (
            <Box display="flex" alignItems="center" gap="$xxs">
              <Text fontSize="$xs">{getVariacaoIcon(data.variacao.tipo)}</Text>
              <Text
                fontSize="$xs"
                color={getVariacaoColor(data.variacao.tipo)}
                fontWeight="$medium"
              >
                {data.variacao.valor > 0 ? "+" : ""}
                {data.variacao.valor.toFixed(1)}%
              </Text>
              <Text fontSize="$xs" color="$tertiary">
                vs {data.variacao.periodo}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};
