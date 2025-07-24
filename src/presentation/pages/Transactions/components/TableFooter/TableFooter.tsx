import { Box } from "@rarui-react/components";

import { TableFooterProps } from "./tableFooter.types";

const TableFooter: React.FC<TableFooterProps> = ({ total }) => {
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
          color="$secondary"
          textAlign="center"
          fontSize="$body-l"
        >
          Total
        </Box>
        <Box as="td" padding="$2xs" verticalAlign="middle"></Box>
        <Box as="td" padding="$2xs" verticalAlign="middle"></Box>
        <Box as="td" padding="$2xs" verticalAlign="middle"></Box>
        <Box as="td" padding="$2xs" verticalAlign="middle"></Box>
        <Box as="td" padding="$2xs" verticalAlign="middle"></Box>
        <Box
          as="td"
          padding="$2xs"
          verticalAlign="middle"
          fontFamily="$body"
          fontWeight="$bold"
          color="$brand"
          textAlign="center"
        >
          {total}
        </Box>
        <Box as="td" padding="$2xs" verticalAlign="middle"></Box>
      </Box>
    </Box>
  );
};

export default TableFooter;
