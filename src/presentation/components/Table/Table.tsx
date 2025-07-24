import { useMemo, type JSX } from "react";
import {
  Box,
  Text,
  Pagination,
  Select,
  Skeleton,
} from "@rarui-react/components";

import { usePagination } from "@/presentation/hooks/core";
import type { TableProps } from "./table.types";
import { pageSizeOptions } from "./table.definitions";
import "./table.css";

function Table<T>({
  columns,
  rows: lines,
  total,
  isLoading,
  children,
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

  const rows = useMemo(
    () =>
      (isLoading
        ? Array.from({ length: 10 })
        : [
            ...lines,
            ...Array.from({ length: 10 - lines.length }).map(() => ({})),
          ]) as T[],
    [lines, isLoading],
  );

  return (
    <>
      <Box display="flex" flexDirection="column" gap="$xs">
        <div className="table-container">
          <Box as="table" width="100%" height="300px">
            <Box
              as="thead"
              position="sticky"
              top="0"
              borderBottomWidth="$2"
              borderStyle="solid"
              borderColor="$divider"
              backgroundColor="$disabled"
              boxShadow="$bottom-1"
              zIndex="$100"
            >
              <Box as="tr">
                {allColumns.map((column, index) => (
                  <Box
                    as="th"
                    key={`${column.label}-${index}`}
                    color="$primary"
                    fontWeight="$bold"
                    textAlign="left"
                    fontFamily="$body"
                    padding="$2xs"
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
                    <>
                      <Box
                        as="td"
                        key={`cell-${rowIndex}-${colIndex}`}
                        padding="$3xs"
                        verticalAlign="middle"
                      >
                        {!isLoading && renderCell(column, row)}
                        {isLoading && (
                          <Skeleton height="29.7px" borderRadius="4px" />
                        )}
                      </Box>
                    </>
                  ))}
                </Box>
              ))}
            </Box>
            {children}
          </Box>
        </div>
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
            onPageChange={(page) => onChangePage({ page, pageSize: pageSize })}
          />
        </Box>
      </Box>
    </>
  );
}

export default Table;
