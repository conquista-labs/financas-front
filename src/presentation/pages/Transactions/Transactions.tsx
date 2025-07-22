import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DateParam,
  StringParam,
  useQueryParam,
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
import { addMonths, format, startOfMonth, subMonths } from "date-fns";

import { urlRouters } from "@/presentation/router/router.definitions";
import {
  useDeleteTransacoesId,
  useGetTransacoes,
} from "@/presentation/hooks/api";
import { Breadcrumb, Table } from "@/presentation/components";
import { usePagination } from "@/presentation/hooks/core";
import { getColumns } from "./transactions.definitions";
import { Filters } from "./components";

const Transactions: React.FC = () => {
  const [openFilters, setOpenFilters] = useState(false);
  const [date, setDate] = useQueryParam(
    "date",
    withDefault(DateParam, new Date()),
  );

  const [params] = useQueryParams({
    categoriaId: withDefault(StringParam, ""),
    pessoaId: withDefault(StringParam, ""),
    meioPagamentoId: withDefault(StringParam, ""),
    formaPagamento: withDefault(StringParam, ""),
  });

  const handleOpenFilters = () => setOpenFilters(!openFilters);

  const { page, pageSize, onChangePage } = usePagination();
  const { data, isLoading } = useGetTransacoes({
    page,
    limit: pageSize,
    date: format(startOfMonth(date), "yyyy-MM-dd"),
    ...params,
  });

  const location = useLocation();
  const currentSearch = location.search;

  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(`${path}${currentSearch}`);
  };

  const { mutate, isPending } = useDeleteTransacoesId();

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$s">
      <Breadcrumb crumbs={["transactions"]} />
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column" gap="$3xs">
          <Box display="flex" gap="$2xs">
            <IconButton
              source={<ArrowLeftIcon size="medium" />}
              onClick={() => setDate(subMonths(date, 1))}
            />
            <Datepicker
              id="month"
              dateFormat="MM/yyyy"
              onChange={(newDate) => {
                setDate(newDate as Date);
                onChangePage({ page: 1, pageSize: 10 });
              }}
              selected={date}
              showMonthYearPicker
            />
            <IconButton
              source={<ArrowRightIcon size="medium" />}
              onClick={() => setDate(addMonths(date, 1))}
            />
          </Box>
        </Box>
        <Box display="flex" gap="$2xs">
          <Button variant="outlined" onClick={handleOpenFilters}>
            Filtros
            <Icon source={<FilterAltOutlinedIcon />} />
          </Button>
          <Button
            as={Link}
            to={`${urlRouters.createTransactions}${currentSearch}`}
          >
            Nova Transação
          </Button>
        </Box>
      </Box>
      <Table
        columns={getColumns(handleNavigate, mutate)}
        rows={data?.data.rows ?? []}
        total={data?.data.meta.total ?? 0}
        isLoading={isLoading || isPending}
      />
      <Filters open={openFilters} onRemove={handleOpenFilters} />
    </Box>
  );
};

export default Transactions;
