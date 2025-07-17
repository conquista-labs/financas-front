import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button } from "@rarui-react/components";

import { urlRouters } from "@/presentation/router/router.definitions";
import { useDeletePessoasId, useGetPessoas } from "@/presentation/hooks/api";
import { Breadcrumb, Table } from "@/presentation/components";
import { getColumns } from "./people.definitions";

const People: React.FC = () => {
  const { data } = useGetPessoas({});
  const navigate = useNavigate();
  const { mutate } = useDeletePessoasId();

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$s">
      <Breadcrumb crumbs={["people"]} />
      <Box display="flex" justifyContent="right">
        <Button as={Link} to={urlRouters.createPeople}>
          Cadastrar
        </Button>
      </Box>
      <Table columns={getColumns(navigate, mutate)} rows={data ?? []} />
    </Box>
  );
};

export default People;
