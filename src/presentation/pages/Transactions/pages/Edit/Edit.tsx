import React from "react";
import { useParams } from "react-router-dom";
import { Box, Title } from "@rarui-react/components";

import {
  useGetTransacoesId,
  usePatchTransacoesId,
} from "@/presentation/hooks/api";
import { Form } from "@/presentation/pages/Transactions/components";
import { Breadcrumb } from "@/presentation/components";

const Edit: React.FC = () => {
  const { id } = useParams();
  const { data: response, isLoading } = useGetTransacoesId({ id: `${id}` });
  const { mutate, isPending } = usePatchTransacoesId({ id: `${id}` });

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      gap="$2xs"
      alignItems="center"
    >
      <Breadcrumb crumbs={["transactions", "editTransactions"]} />
      <Title as="h4" color="$brand">
        Editar transação
      </Title>
      <Box width={{ xs: "100%", lg: "1110px" }}>
        <Form
          defaultValues={response?.data}
          isPending={isPending || isLoading}
          onSubmit={mutate}
        />
      </Box>
    </Box>
  );
};

export default Edit;
