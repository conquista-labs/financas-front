import { useMemo, useCallback } from "react";
import { NumberParam, useQueryParams, withDefault } from "use-query-params";

import { UsePaginationProps } from "./usePagination.types";

const usePagination = (totalItems = 0): UsePaginationProps => {
  const [param, setParam] = useQueryParams({
    page: withDefault(NumberParam, 1),
    pageSize: withDefault(NumberParam, 10),
  });

  const getTotalPages = useCallback(
    (totalItems: number) => {
      const total = Math.ceil(totalItems / param.pageSize);
      return total > 0 ? total : 1;
    },
    [param.pageSize],
  );

  const onChangePage = useCallback(
    (pagination: { page: number; pageSize: number }) => {
      setParam(pagination);
    },
    [setParam],
  );

  const onChangePageSize = useCallback(
    (pageSize: number) => {
      setParam({
        page: param.page,
        pageSize,
      });
    },
    [setParam],
  );

  return {
    skip: useMemo(
      () => param.page * param.pageSize,
      [param.page, param.pageSize],
    ),
    totalPages: useMemo(
      () => getTotalPages(totalItems),
      [totalItems, getTotalPages],
    ),
    page: useMemo(() => param.page, [param.page]),
    pageSize: param.pageSize,
    onChangePage,
    onChangePageSize,
    getTotalPages,
  };
};

export default usePagination;
