import React, { useMemo, useState, useCallback } from "react";
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
  useGetRelatorioTransacoes,
} from "@/presentation/hooks/api";
import { Breadcrumb, Table } from "@/presentation/components";
import { useIsMobile, usePagination } from "@/presentation/hooks/core";
import { getColumns } from "./transactions.definitions";
import { Filters, TableFooter } from "./components";

const Transactions: React.FC = () => {
  const { isMobile } = useIsMobile();
  const [openFilters, setOpenFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [queryParams, setQueryParams] = useQueryParams({
    startDate: withDefault(DateParam, startOfMonth(new Date())),
    endDate: DateParam,
    categoriaId: withDefault(StringParam, ""),
    pessoaId: withDefault(StringParam, ""),
    meioPagamentoId: withDefault(StringParam, ""),
    formaPagamento: withDefault(StringParam, ""),
    search: withDefault(StringParam, ""),
    tipo: withDefault(StringParam, ""),
  });

  const formattedParams = useMemo(
    () => ({
      ...queryParams,
      startDate: format(queryParams.startDate, "yyyy-MM-dd"),
      endDate: queryParams.endDate
        ? format(queryParams.endDate, "yyyy-MM-dd")
        : "",
    }),
    [queryParams],
  );

  const { page, pageSize, onChangePage } = usePagination();
  const {
    data,
    isLoading: isLoadingGetTransacoes,
    refetch,
  } = useGetTransacoes({
    page,
    limit: pageSize,
    ...formattedParams,
  });

  const {
    refetch: getRelatorioTransacoes,
    isLoading: isLoadingGetRelatorioTransacoes,
  } = useGetRelatorioTransacoes(
    { page, limit: pageSize, ...formattedParams },
    { enabled: false },
  );

  const { mutate, isPending } = useDeleteTransacoesId();

  const currentSearch = location.search;

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(`${path}${currentSearch}`);
    },
    [navigate, currentSearch],
  );

  const handleDateChange = ([newStartDate, newEndDate]: [Date, Date]) => {
    setQueryParams({ startDate: newStartDate, endDate: newEndDate });
    onChangePage({ page: 1, pageSize });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const multiplier = direction === "prev" ? -1 : 1;
    const newStart = addMonths(queryParams.startDate, multiplier);
    const newEnd = queryParams.endDate
      ? addMonths(queryParams.endDate, multiplier)
      : endOfMonth(newStart);

    setQueryParams({ startDate: newStart, endDate: newEnd });
    onChangePage({ page: 1, pageSize: 10 });
  };

  const handleResume = async () => {
    try {
      const { data } = await getRelatorioTransacoes();
      const blob = new Blob([data as unknown as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    }
  };

  const columns = useMemo(
    () => getColumns(handleNavigate, mutate, refetch),
    [handleNavigate, mutate, refetch],
  );

  const isLoading = useMemo(
    () =>
      isLoadingGetTransacoes || isLoadingGetRelatorioTransacoes || isPending,
    [isLoadingGetTransacoes, isLoadingGetRelatorioTransacoes, isPending],
  );

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
              onChange={(dates) => handleDateChange(dates as [Date, Date])}
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
            onClick={() => setOpenFilters(!openFilters)}
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
        columns={columns}
        rows={data?.data.rows ?? []}
        total={data?.data.meta.total ?? 0}
        isLoading={isLoading}
      >
        <TableFooter
          total={data?.data.resume.total ?? "R$ 0.00"}
          handleResume={handleResume}
        />
      </Table>
      <Filters open={openFilters} onRemove={() => setOpenFilters(false)} />
    </Box>
  );
};

export default Transactions;
