import { Box, Text } from "@rarui-react/components";
import type { TableProps } from "./table.types";
import type { JSX } from "react";

function Table<T>({ columns, rows }: TableProps<T>): JSX.Element {
  const allColumns = columns.getColumns();

  const renderCell = (column: (typeof allColumns)[number], row: T) => {
    const value = row[column.field];
    const formatter = column.options?.formatter;

    if (formatter) return formatter(value, row);

    return (
      <Text color="$primary" fontSize="$s">
        {String(value)}
      </Text>
    );
  };

  return (
    <Box
      backgroundColor="$primary"
      padding="$2xs"
      borderWidth="$1"
      borderStyle="solid"
      borderColor="$subdued"
      borderRadius="$xs"
      pb="$none"
    >
      <Box as="table" width="100%">
        <Box as="thead">
          <Box
            as="tr"
            borderBottomWidth="$2"
            borderStyle="solid"
            borderColor="$divider"
          >
            {allColumns.map((column, index) => (
              <Box
                as="th"
                key={`${column.label}-${index}`}
                color="$primary"
                fontWeight="$bold"
                textAlign="left"
                fontFamily="$body"
                padding="$2xs"
                {...column.options?.boxProps}
              >
                {column.label}
              </Box>
            ))}
          </Box>
        </Box>
        <Box as="tbody">
          {rows?.map((row, rowIndex) => (
            <Box
              as="tr"
              key={`row-${rowIndex}`}
              borderBottomWidth="$1"
              borderStyle="solid"
              borderColor={
                rows.length - 1 !== rowIndex ? "$divider" : "$transparent"
              }
            >
              {allColumns.map((column, colIndex) => (
                <Box as="td" key={`cell-${rowIndex}-${colIndex}`} padding="$xs">
                  {renderCell(column, row)}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Table;
