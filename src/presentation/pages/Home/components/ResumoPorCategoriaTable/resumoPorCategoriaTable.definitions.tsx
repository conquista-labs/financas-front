import { Box, Text } from "@rarui-react/components";
import { ColumnsDefinitions } from "@/presentation/components";
import { formatCurrency } from "@/presentation/pages/Home/home.definitions";

export const getColumns = () =>
  new ColumnsDefinitions<any>()
    .setColum("Categoria", "categoria", {
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
    })
    .setColum("Jan", "jan", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Fev", "fev", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Mar", "mar", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Abr", "abr", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Mai", "mai", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Jun", "jan", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Jul", "jul", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Ago", "ago", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Set", "set", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Out", "out", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Nov", "nov", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Dez", "dez", {
      formatter: (field) => (
        <Text fontSize="$s" color="$primary">
          {formatCurrency(field)}
        </Text>
      ),
    })
    .setColum("Ano", "ano", {
      formatter: (field) => (
        <Text fontSize="$s" color="$brand" fontWeight="$bold">
          {formatCurrency(field)}
        </Text>
      ),
    });

export const formatMonth = (mes: string): string => {
  const [ano, mesNum] = mes.split("-");
  return new Date(Number(ano), Number(mesNum) - 1)
    .toLocaleString("pt-BR", { month: "short" })
    .toLowerCase()
    .replace(".", "");
};
