import { Fragment, useMemo, type JSX } from "react";
import {
  Box,
  Text,
  Pagination,
  Select,
  Skeleton,
} from "@rarui-react/components";

import {
  usePagination,
  useTableHeight,
  useIsMobile,
} from "@/presentation/hooks/core";
import type { TableProps } from "./table.types";
import { pageSizeOptions } from "./table.definitions";
import { Loading } from "../Loading";
import "./table.css";

function Table<T>({
  columns,
  rows: lines,
  total,
  isLoading,
  children,
  tableContainerStyles,
  showPagination = true,
  enableDynamicHeight = false,
  dynamicHeightOptions = {},
}: TableProps<T>): JSX.Element {
  const { isMobile } = useIsMobile();

  const defaultDynamicOptions = {
    baseOffset: isMobile ? 120 : 200,
    headerHeight: isMobile ? 180 : 120,
    footerHeight: 60,
    paginationHeight: isMobile ? 120 : 80,
    rowHeight: 45,
    minTableHeight: isMobile ? 250 : 300,
    ...dynamicHeightOptions,
  };

  const { tableHeight, maxVisibleRows } = useTableHeight(
    enableDynamicHeight ? defaultDynamicOptions : { minTableHeight: 300 },
  );

  const { page, totalPages, pageSize, onChangePage, onChangePageSize } =
    usePagination(total);

  const allColumns = columns.getColumns();

  const renderCell = (column: (typeof allColumns)[number], row: T) => {
    const value = row[column.field];
    const formatter = column.options?.formatter;
    const boxProps = column.options?.boxProps;
    const defautValue = column.options?.defautValue;

    if (!value && value !== 0)
      return (
        <Box height="40.5px" display="flex" alignItems="center" width="100%">
          <Text
            textAlign={boxProps?.textAlign}
            color={defautValue ? "$primary" : "$disabled"}
            width="100%"
            fontSize="$s"
          >
            {defautValue ? defautValue : "—"}
          </Text>
        </Box>
      );
    if (formatter) return formatter(value, row);

    return (
      <Text color="$primary" fontSize="$s">
        {String(value)}
      </Text>
    );
  };

  const rows = useMemo(() => {
    const targetRowCount = enableDynamicHeight ? maxVisibleRows : 8;

    if (isLoading) {
      return Array.from({ length: targetRowCount }) as T[];
    }

    const emptyCount = Math.max(0, targetRowCount - lines.length);
    const filledRows = lines;

    // Garante que cada linha vazia tenha um ID único se necessário
    const emptyRows = Array.from({ length: emptyCount }, () =>
      Object.fromEntries(allColumns.map((column) => [column.field, ""])),
    ) as T[];

    return [...filledRows, ...emptyRows];
  }, [lines, isLoading, allColumns, maxVisibleRows, enableDynamicHeight]);

  return (
    <>
      <Box display="grid" flexDirection="column" gap="$xs" width="100%">
        <div
          className="table-container"
          style={{
            ...tableContainerStyles,
            ...(enableDynamicHeight && {
              height: `${tableHeight}px`,
              overflow: "auto",
            }),
          }}
        >
          <Box
            as="table"
            width="100%"
            {...(enableDynamicHeight
              ? { height: "100%" }
              : { maxHeight: "300px" })}
          >
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
                    <Fragment key={`cell-${rowIndex}-${colIndex}`}>
                      <Box as="td" padding="$3xs" verticalAlign="middle">
                        {!isLoading && renderCell(column, row)}
                        {isLoading && (
                          <Skeleton height="29px" borderRadius="4px" />
                        )}
                      </Box>
                    </Fragment>
                  ))}
                </Box>
              ))}
            </Box>
            {children}
          </Box>
        </div>
        {showPagination && (
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
              onPageChange={(page) =>
                onChangePage({ page, pageSize: pageSize })
              }
            />
          </Box>
        )}
        <Loading isLoading={isLoading} />
      </Box>
    </>
  );
}

export default Table;
