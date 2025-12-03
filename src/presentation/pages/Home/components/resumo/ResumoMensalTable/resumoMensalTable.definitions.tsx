import { Box, Text } from "@rarui-react/components";

import { ColumnsDefinitions } from "@/presentation/components";
import {
  formatCurrency,
  formatPercentage,
  getTrendIcon,
  getColorBySign,
  formatMonthLong,
} from "@/presentation/pages/Home/utils";

export const getColumns = () =>
  new ColumnsDefinitions<any>()
    .setColum("Mês", "mes")
    .setColum("Despesas", "despesa", {
      formatter: (field) => (
        <Text fontSize="$s" color="$error" textAlign="center">
          {formatCurrency(field)}
        </Text>
      ),
      boxProps: { textAlign: "center" },
    })
    .setColum("Receitas", "receita", {
      formatter: (field) => (
        <Text fontSize="$s" color="$success" textAlign="center">
          {formatCurrency(field)}
        </Text>
      ),
      boxProps: { textAlign: "center" },
    })
    .setColum("% Gasto", "percentualGasto", {
      formatter: (field, row) => {
        if (!field)
          return (
            <Text fontSize="$s" color="$disabled" textAlign="center">
              —
            </Text>
          );

        const status = row.statusFinanceiro;
        let color = "$secondary";
        let backgroundColor = "$transparent";

        if (status === "controlado") {
          color = "$success";
          backgroundColor = "$success-press";
        } else if (status === "atencao") {
          color = "$warning";
          backgroundColor = "$warning-press";
        } else if (status === "alerta") {
          color = "$error";
          backgroundColor = "$error-press";
        }

        return (
          <Box display="flex" justifyContent="center">
            <Box
              paddingY="$4xs"
              paddingX="$3xs"
              borderRadius="$2xs"
              backgroundColor={backgroundColor as any}
            >
              <Text fontSize="$s" color={color as any} fontWeight="$semiBold">
                {formatPercentage(field)}
              </Text>
            </Box>
          </Box>
        );
      },
      boxProps: { textAlign: "center" },
    })
    .setColum("Saldo mês anterior", "saldoMesAnterior", {
      formatter: (field) => (
        <Text fontSize="$s" color="$success" textAlign="center">
          {formatCurrency(field)}
        </Text>
      ),
      boxProps: { textAlign: "center" },
    })
    .setColum("Saldo", "saldo", {
      formatter: (field) => {
        const isPositive = field > 0;
        return (
          <Box display="flex" justifyContent="flex-end">
            <Box
              paddingY="$4xs"
              paddingX="$3xs"
              borderRadius="$2xs"
              width="fit-content"
              backgroundColor={isPositive ? "$success-press" : "$error-press"}
            >
              <Text fontSize="$s" color={getColorBySign(field)}>
                {formatCurrency(field)}
              </Text>
            </Box>
          </Box>
        );
      },
      boxProps: {
        textAlign: "right",
      },
    })
    .setColum("Δ Anterior", "deltaMesAnterior", {
      formatter: (field, row) => {
        if (!field)
          return (
            <Text fontSize="$s" color="$disabled" textAlign="center">
              —
            </Text>
          );

        const icon = getTrendIcon(row.tendencia);

        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="$4xs"
          >
            <Text fontSize="$s">{icon}</Text>
            <Text
              fontSize="$s"
              color={getColorBySign(field)}
              fontWeight="$semiBold"
            >
              {formatCurrency(Math.abs(field))}
            </Text>
          </Box>
        );
      },
      boxProps: { textAlign: "center" },
    });

// Re-exporta para manter compatibilidade com código existente
export const formatMonth = formatMonthLong;
