import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DateParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
import {
  Box,
  Button,
  Datepicker,
  Icon,
  IconButton,
} from "@rarui-react/components";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FilterAltOutlinedIcon,
} from "@rarui/icons";
import { addMonths, format, startOfMonth, endOfMonth } from "date-fns";

import { urlRouters } from "@/presentation/router/router.definitions";
import {
  useDeleteTransacoesId,
  useGetTransacoes,
  // usePostResumoFinanceiro,
} from "@/presentation/hooks/api";
import { Breadcrumb, Table } from "@/presentation/components";
import { useIsMobile, usePagination } from "@/presentation/hooks/core";
import { getColumns } from "./transactions.definitions";
import { Filters, TableFooter } from "./components";

const Transactions: React.FC = () => {
  const { isMobile } = useIsMobile();
  const [openFilters, setOpenFilters] = useState(false);

  const [queryParams, setQueryParams] = useQueryParams({
    startDate: withDefault(DateParam, startOfMonth(new Date())),
    endDate: DateParam,
    categoriaId: withDefault(StringParam, ""),
    pessoaId: withDefault(StringParam, ""),
    meioPagamentoId: withDefault(StringParam, ""),
    formaPagamento: withDefault(StringParam, ""),
    search: withDefault(StringParam, ""),
  });

  const handleOpenFilters = () => setOpenFilters(!openFilters);

  const { page, pageSize, onChangePage } = usePagination();
  const { data, isLoading, refetch } = useGetTransacoes({
    page,
    limit: pageSize,
    ...queryParams,
    startDate: format(queryParams.startDate, "yyyy-MM-dd"),
    endDate: queryParams.endDate
      ? format(queryParams.endDate, "yyyy-MM-dd")
      : "",
  });

  // const { mutate } = usePostResumoFinanceiro();

  const location = useLocation();
  const currentSearch = location.search;

  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(`${path}${currentSearch}`);
  };

  const handleChange = ([newStartDate, newEndDate]: [Date, Date]) => {
    setQueryParams({
      startDate: newStartDate,
      endDate: newEndDate,
    });
    onChangePage({ page: 1, pageSize: pageSize });
  };

  const { mutate, isPending } = useDeleteTransacoesId();

  const navigateMonth = (direction: "prev" | "next") => {
    const multiplier = direction === "prev" ? -1 : 1;

    setQueryParams({
      startDate: addMonths(queryParams.startDate, multiplier),
      endDate: queryParams.endDate
        ? addMonths(queryParams.endDate, multiplier)
        : addMonths(endOfMonth(queryParams.startDate), multiplier),
    });

    onChangePage({ page: 1, pageSize: 10 }); // garante reset de paginação
  };

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$s">
      <Breadcrumb crumbs={["transactions"]} />
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xs: "column", md: "row" }}
        gap="$2xs"
      >
        <Box display="flex" flexDirection="column" gap="$3xs">
          <Box display="flex" gap="$2xs" width={{ xs: "100%", md: "400px" }}>
            <IconButton
              source={<ArrowLeftIcon size="medium" />}
              onClick={() => navigateMonth("prev")}
            />
            <Datepicker
              id="month"
              dateFormat="MMMM d, yyyy"
              startDate={queryParams.startDate}
              endDate={queryParams.endDate as Date}
              onChange={(dates) => handleChange(dates as [Date, Date])}
              selected={queryParams.startDate}
              selectsRange
            />
            <IconButton
              source={<ArrowRightIcon size="medium" />}
              onClick={() => navigateMonth("next")}
            />
          </Box>
        </Box>
        <Box
          display="flex"
          gap="$2xs"
          flexDirection={{ xs: "column", md: "row" }}
        >
          <Button
            variant="outlined"
            onClick={handleOpenFilters}
            full={isMobile}
          >
            Filtros
            <Icon source={<FilterAltOutlinedIcon />} />
          </Button>
          <Button
            as={Link}
            to={`${urlRouters.createTransactions}${currentSearch}`}
            full={isMobile}
          >
            Nova Transação
          </Button>
        </Box>
      </Box>
      <Table
        columns={getColumns(handleNavigate, mutate, refetch)}
        rows={data?.data.rows ?? []}
        total={data?.data.meta.total ?? 0}
        isLoading={isLoading || isPending}
      >
        <TableFooter total={data?.data.resume.total ?? "R$ 0.00"} />
      </Table>
      <Filters open={openFilters} onRemove={handleOpenFilters} />
    </Box>
  );
};

export default Transactions;
