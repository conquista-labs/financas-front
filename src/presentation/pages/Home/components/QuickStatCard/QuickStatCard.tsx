import { Box, Card, Icon, Skeleton, Text } from "@rarui-react/components";

import { QuickStatCardProps } from "./quickStatCard.types";
import {
  getVariacaoColor,
  getVariacaoIcon,
  icons,
} from "./quickStatCard.definitions.tsx";

export const QuickStatCard: React.FC<QuickStatCardProps> = ({
  data,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <Box display="flex" flexDirection="column" gap="$xs">
          <Skeleton width="70%" height="16px" />
          <Skeleton width="50%" height="42px" />
          <Skeleton width="60%" height="14px" />
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        {/* Header com ícone e título */}
        <Box display="flex" alignItems="center" gap="$4xs" marginBottom="$xs">
          {data?.icone && (
            <Icon
              color={data.cor as any}
              source={icons[data.icone as keyof typeof icons]}
            />
          )}
          <Text
            fontSize="$s"
            fontWeight="$medium"
            color="$secondary"
            lineHeight="$s"
          >
            {data?.titulo ?? ""}
          </Text>
        </Box>

        {/* Valor principal */}
        <Box marginBottom="$3xs">
          <Text
            fontSize="$xl"
            fontWeight="$bold"
            color={data?.cor as any}
            lineHeight="$m"
          >
            {data?.valor ?? "R$ 0,00"}
          </Text>
        </Box>

        {/* Footer com subtítulo e variação */}
        <Box display="flex" flexDirection="column" gap="$3xs">
          {data?.subtitulo && (
            <Text fontSize="$xs" color="$secondary" lineHeight="$xs">
              {data.subtitulo}
            </Text>
          )}

          {data?.variacao && (
            <Box display="flex" alignItems="center" gap="$4xs">
              <Text fontSize="$xs">{getVariacaoIcon(data.variacao.tipo)}</Text>
              <Text
                fontSize="$xs"
                color={getVariacaoColor(data.variacao.tipo)}
                fontWeight="$medium"
              >
                {data.variacao.valor > 0 ? "+" : ""}
                {data.variacao.valor.toFixed(1)}%
              </Text>
              <Text fontSize="$xs" color="$secondary">
                vs {data.variacao.periodo}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};
