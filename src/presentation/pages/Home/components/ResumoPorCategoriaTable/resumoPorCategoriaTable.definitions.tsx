import { Box, Text } from "@rarui-react/components";
import { ColumnsDefinitions } from "@/presentation/components";
import { formatCurrency } from "@/presentation/pages/Home/home.definitions";

const getColorByTeto = (valor: number, teto?: number) => {
  if (!teto) return "$primary";
  if (valor >= teto) return "$error";
  if (valor > teto * 0.85) return "$warning-alt";
  return "$primary";
};

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
        const color = getColorByTeto(field, row.tetoGasto);
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
      const color = getColorByTeto(field, row.tetoGastoAno);
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

// Converte "2025-01" para "jan"
export const formatMonth = (mes: string): string => {
  const [ano, mesNum] = mes.split("-");
  return new Date(Number(ano), Number(mesNum) - 1)
    .toLocaleString("pt-BR", { month: "short" })
    .toLowerCase()
    .replace(".", "");
};
