import { Box } from "@rarui-react/components";

import { formatCurrency } from "@/presentation/pages/Home/home.definitions";
import { TableFooterProps } from "./tableFooter.types";

const TableFooter: React.FC<TableFooterProps> = ({
  despesasAno,
  receitasAno,
}) => {
  return (
    <Box
      as="tfoot"
      position="sticky"
      bottom="0"
      borderStyle="solid"
      borderColor="$divider"
      backgroundColor="$primary"
      boxShadow="$top-1"
      zIndex="$200"
    >
      <Box
        as="tr"
        borderTopWidth="$2"
        borderStyle="solid"
        borderColor="$divider"
        backgroundColor="$disabled"
      >
        <Box
          as="td"
          padding="$2xs"
          verticalAlign="middle"
          fontFamily="$body"
          fontWeight="$bold"
          color="$primary"
          textAlign="left"
          fontSize="$body-m"
        >
          Ano
        </Box>
        <Box
          as="td"
          padding="$2xs"
          verticalAlign="middle"
          fontFamily="$body"
          fontWeight="$bold"
          fontSize="$body-s"
          color="$error"
          textAlign="center"
        >
          {formatCurrency(despesasAno)}
        </Box>
        <Box
          as="td"
          padding="$2xs"
          verticalAlign="middle"
          fontFamily="$body"
          fontWeight="$bold"
          fontSize="$body-s"
          color="$success"
          textAlign="center"
        >
          {formatCurrency(receitasAno)}
        </Box>
        {/* % Gasto - Coluna vazia no footer */}
        <Box as="td" padding="$2xs" verticalAlign="middle" textAlign="center">
          —
        </Box>
        <Box as="td" padding="$2xs" verticalAlign="middle" textAlign="center">
          —
        </Box>
        <Box as="td" padding="$2xs" verticalAlign="middle" textAlign="right">
          —
        </Box>
        {/* Δ Anterior - Coluna vazia no footer */}
        <Box as="td" padding="$2xs" verticalAlign="middle" textAlign="center">
          —
        </Box>
      </Box>
    </Box>
  );
};

export default TableFooter;
