import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { DateParam, useQueryParam, withDefault } from "use-query-params";
import { Box, Button, Datepicker } from "@rarui-react/components";

import { urlRouters } from "@/presentation/router/router.definitions";
import {
  useDeleteTransacoesId,
  useGetTransacoes,
} from "@/presentation/hooks/api";
import { Breadcrumb, Table } from "@/presentation/components";
import { usePagination } from "@/presentation/hooks/core";
import { getColumns } from "./transactions.definitions";

const Transactions: React.FC = () => {
  const [date, setDate] = useQueryParam(
    "date",
    withDefault(DateParam, new Date()),
  );

  const { page, pageSize } = usePagination();
  const { data, isLoading } = useGetTransacoes({ page, date, limit: pageSize });

  const navigate = useNavigate();
  const { mutate, isPending } = useDeleteTransacoesId();

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$s">
      <Breadcrumb crumbs={["transactions"]} />
      <Box display="flex" justifyContent="right">
        <Button as={Link} to={urlRouters.createTransactions}>
          Nova Transação
        </Button>
      </Box>
      <Box>
        <Datepicker
          dateFormat="MM/yyyy"
          onChange={(newDate) => setDate(newDate as Date)}
          selected={date}
          showMonthYearPicker
        />
      </Box>
      <Table
        columns={getColumns(navigate, mutate)}
        rows={data?.data.rows ?? []}
        total={data?.data.meta.total ?? 0}
        isLoading={isLoading || isPending}
      />
    </Box>
  );
};

export default Transactions;
