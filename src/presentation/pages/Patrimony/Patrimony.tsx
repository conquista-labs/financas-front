import React, { useMemo } from "react";
import { Box, Button } from "@rarui-react/components";
import { Link, useNavigate } from "react-router-dom";

import { Breadcrumb, Table } from "@/presentation/components";
import {
  useDeletePatrimonioId,
  useGetPatrimonios,
} from "@/presentation/hooks/api";
import { urlRouters } from "@/presentation/router/router.definitions";
// import { TableFooter } from "./components";
import { getColumns } from "./patrimony.definitions";

const Patrimony: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useGetPatrimonios();
  const { mutate, isPending } = useDeletePatrimonioId();
  const columns = useMemo(
    () => getColumns(navigate, mutate, refetch),
    [navigate, mutate, refetch],
  );

  return (
    <Box display="flex" flexDirection="column" gap="$s">
      {/* Breadcrumb */}
      <Breadcrumb crumbs={["patrimony"]} />

      {/* Header */}
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <Button
          as={Link}
          to={urlRouters.createPatrimony}
          variant="solid"
          size="medium"
        >
          Adicionar
        </Button>
      </Box>

      <Table
        columns={columns}
        total={data?.data?.meta?.total ?? 0}
        rows={data?.data?.rows ?? []}
        isLoading={isLoading || isPending}
      >
        {/* <TableFooter /> */}
      </Table>
    </Box>
  );
};

export default Patrimony;
