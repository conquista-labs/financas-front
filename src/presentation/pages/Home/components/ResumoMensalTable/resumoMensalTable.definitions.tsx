import { Box, Text } from "@rarui-react/components";
import { ColumnsDefinitions } from "@/presentation/components";
import { formatCurrency } from "@/presentation/pages/Home/home.definitions";

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
              <Text fontSize="$s" color={isPositive ? "$success" : "$error"}>
                {formatCurrency(field)}
              </Text>
            </Box>
          </Box>
        );
      },
      boxProps: {
        textAlign: "right",
      },
    });

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const formatMonth = (mes: string) => {
  const [year, month] = mes.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    date,
  );
  return capitalize(monthName);
};
