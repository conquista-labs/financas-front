import { type JSX } from "react";
import { Box, Text, Pagination, Select } from "@rarui-react/components";

import { usePagination } from "@/presentation/hooks/core";
import type { TableProps } from "./table.types";
import { pageSizeOptions } from "./table.definitions";
import { Loading } from "../Loading";

function Table<T>({
  columns,
  rows,
  total,
  isLoading,
}: TableProps<T>): JSX.Element {
  const { page, totalPages, pageSize, onChangePage, onChangePageSize } =
    usePagination(total);

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
    <>
      <Box display="flex" flexDirection="column" gap="$xs">
        <Box
          backgroundColor="$primary"
          padding="$2xs"
          borderWidth="$1"
          borderStyle="solid"
          borderColor="$subdued"
          borderRadius="$xs"
          pb="$none"
          minHeight={{ md: "550px" }}
          overflowX="auto"
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
                    padding="$3xs"
                    paddingBottom="$2xs"
                    verticalAlign="middle"
                    fontSize="$body-s"
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
                  borderColor="$divider"
                >
                  {allColumns.map((column, colIndex) => (
                    <Box
                      as="td"
                      key={`cell-${rowIndex}-${colIndex}`}
                      padding="$3xs"
                      verticalAlign="middle"
                    >
                      {renderCell(column, row)}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: "column", md: "row" }}
          gap="$2xs"
        >
          <Box display="flex" alignItems="center" gap="$2xs">
            <Text color="$brand" fontSize="$s" fontWeight="$bold">
              Itens por página
            </Text>
            <Select
              enabledFlip
              value={pageSizeOptions.find(
                (option) => Number(option.value) === pageSize,
              )}
              options={pageSizeOptions}
              onChange={(option: any) => onChangePageSize(option?.[0].value)}
            />
          </Box>
          <Pagination
            activePage={page}
            pageCount={totalPages}
            onPageChange={(page) => onChangePage({ page, pageSize: 10 })}
          />
        </Box>
      </Box>
      <Loading isLoading={isLoading} />
    </>
  );
}

export default Table;
