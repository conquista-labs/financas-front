import { Box, Text } from "@rarui-react/components";

import { ColumnsDefinitions } from "@/presentation/components";
import {
  formatCurrency,
  getColorByThreshold,
  formatMonthAbbr,
} from "@/presentation/pages/Home/utils";

const monthKeys = [
  { label: "Jan", key: "jan" },
  { label: "Fev", key: "fev" },
  { label: "Mar", key: "mar" },
  { label: "Abr", key: "abr" },
  { label: "Mai", key: "mai" },
  { label: "Jun", key: "jun" },
  { label: "Jul", key: "jul" },
  { label: "Ago", key: "ago" },
  { label: "Set", key: "set" },
  { label: "Out", key: "out" },
  { label: "Nov", key: "nov" },
  { label: "Dez", key: "dez" },
];

export const getColumns = () => {
  const columns = new ColumnsDefinitions<any>();

  columns.setColum("Categoria", "categoria", {
    formatter: (field, row) => (
      <Box display="flex" justifyContent="center">
        <div className="categorie-badge" style={{ background: row?.cor }}>
          {field}
        </div>
      </Box>
    ),
    boxProps: {
      width: "150px",
      textAlign: "center",
    },
  });

  monthKeys.forEach(({ label, key }) => {
    columns.setColum(label, key, {
      formatter: (field, row) => {
        const color = getColorByThreshold(field, row.tetoGastoMes);
        return (
          <Text fontSize="$s" color={color}>
            {formatCurrency(field)}
          </Text>
        );
      },
      defautValue: "R$ 0,00",
    });
  });

  columns.setColum("Ano", "ano", {
    formatter: (field, row) => {
      const color = getColorByThreshold(field, row.tetoGastoAno);
      return (
        <Text
          fontSize="$s"
          color={color}
          fontWeight="$semiBold"
          textAlign="center"
        >
          {formatCurrency(field)}
        </Text>
      );
    },
    boxProps: { textAlign: "center" },
  });

  return columns;
};

// Re-exporta para manter compatibilidade com código existente
export const formatMonth = formatMonthAbbr;
