import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button } from "@rarui-react/components";

import { urlRouters } from "@/presentation/router/router.definitions";
import {
  useDeleteMeiosPagamentoId,
  useGetMeiosPagamento,
} from "@/presentation/hooks/api";
import { Breadcrumb, Table } from "@/presentation/components";
import { usePagination } from "@/presentation/hooks/core";
import { getColumns } from "./meansOfPayment.definitions";

const MeansOfPayment: React.FC = () => {
  const { page, pageSize } = usePagination();
  const { data, isLoading } = useGetMeiosPagamento({ page, limit: pageSize });

  const navigate = useNavigate();
  const { mutate, isPending } = useDeleteMeiosPagamentoId();

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$s">
      <Breadcrumb crumbs={["meansOfPayment"]} />
      <Box display="flex" justifyContent="right">
        <Button as={Link} to={urlRouters.createMeansOfPayment}>
          Cadastrar
        </Button>
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

export default MeansOfPayment;
