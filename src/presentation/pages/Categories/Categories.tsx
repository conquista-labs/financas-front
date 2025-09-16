import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Button } from "@rarui-react/components";

import { urlRouters } from "@/presentation/router/router.definitions";
import {
  useDeleteCategoriasId,
  useGetCategorias,
} from "@/presentation/hooks/api";
import { Breadcrumb, Table } from "@/presentation/components";
import { usePagination } from "@/presentation/hooks/core";
import { getColumns } from "./categories.definitions";

const Categories: React.FC = () => {
  const { page, pageSize } = usePagination();
  const { data, isLoading, refetch } = useGetCategorias({
    page,
    limit: pageSize,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const currentSearch = location.search;

  const { mutate, isPending } = useDeleteCategoriasId();

  const handleNavigate = (path: string) => {
    navigate(`${path}${currentSearch}`);
  };

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$s">
      <Breadcrumb crumbs={["categories"]} />
      <Box display="flex" justifyContent="right">
        <Button as={Link} to={urlRouters.createCategories}>
          Cadastrar
        </Button>
      </Box>
      <Table
        columns={getColumns(handleNavigate, mutate, refetch)}
        rows={data?.data.rows ?? []}
        total={data?.data.meta.total ?? 0}
        isLoading={isLoading || isPending}
        enableDynamicHeight
      />
    </Box>
  );
};

export default Categories;
