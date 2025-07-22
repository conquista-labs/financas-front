import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DateParam, useQueryParam } from "use-query-params";
import { Box, Button, Datepicker, IconButton } from "@rarui-react/components";
import { ArrowLeftIcon, ArrowRightIcon } from "@rarui/icons";
import { addMonths, format, subMonths } from "date-fns";

import { urlRouters } from "@/presentation/router/router.definitions";
import {
  useDeleteTransacoesId,
  useGetTransacoes,
} from "@/presentation/hooks/api";
import { Breadcrumb, Table } from "@/presentation/components";
import { usePagination } from "@/presentation/hooks/core";
import { getColumns } from "./transactions.definitions";

const Transactions: React.FC = () => {
  const [date, setDate] = useQueryParam("date", DateParam);

  const todayDate = format(new Date(), "yyyy-MM-dd") as unknown as Date;

  const { page, pageSize, onChangePage } = usePagination();
  const { data, isLoading } = useGetTransacoes({
    page,
    date: date ?? todayDate,
    limit: pageSize,
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
              onClick={() => setDate(subMonths(date ?? todayDate, 1))}
            />
            <Datepicker
              id="month"
              dateFormat="MM/yyyy"
              onChange={(newDate) => {
                setDate(newDate as Date);
                onChangePage({ page: 1, pageSize: 10 });
              }}
              selected={date ?? todayDate}
              showMonthYearPicker
            />
            <IconButton
              source={<ArrowRightIcon size="medium" />}
              onClick={() => setDate(addMonths(date ?? todayDate, 1))}
            />
          </Box>
        </Box>
        <Button
          as={Link}
          to={`${urlRouters.createTransactions}${currentSearch}`}
        >
          Nova Transação
        </Button>
      </Box>
      <Table
        columns={getColumns(handleNavigate, mutate)}
        rows={data?.data.rows ?? []}
        total={data?.data.meta.total ?? 0}
        isLoading={isLoading || isPending}
      />
    </Box>
  );
};

export default Transactions;
