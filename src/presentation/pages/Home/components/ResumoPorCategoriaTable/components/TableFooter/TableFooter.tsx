import { Box } from "@rarui-react/components";

import { formatCurrency } from "@/presentation/pages/Home/home.definitions";
import { TableFooterProps } from "./tableFooter.types";

const TableFooter: React.FC<TableFooterProps> = ({
  totalDespesasAno,
  totalReceitasAno,
}) => {
  const saldo = totalReceitasAno - totalDespesasAno;
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
        >
          {formatCurrency(totalDespesasAno)}
        </Box>
        <Box
          as="td"
          padding="$2xs"
          verticalAlign="middle"
          fontFamily="$body"
          fontWeight="$bold"
          fontSize="$body-s"
          color="$success"
        >
          {formatCurrency(totalReceitasAno)}
        </Box>
        <Box
          as="td"
          padding="$2xs"
          verticalAlign="middle"
          fontFamily="$body"
          fontWeight="$bold"
          fontSize="$body-s"
          color={saldo > 0 ? "$success" : "$error"}
          textAlign="right"
        >
          {formatCurrency(saldo)}
        </Box>
      </Box>
    </Box>
  );
};

export default TableFooter;
