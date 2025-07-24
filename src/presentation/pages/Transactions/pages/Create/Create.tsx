import React from "react";
import { Box, Title } from "@rarui-react/components";

import { Form } from "@/presentation/pages/Transactions/components";
import { Breadcrumb } from "@/presentation/components";
import { usePostTransacoes } from "@/presentation/hooks/api";

const Create: React.FC = () => {
  const { mutate, isPending } = usePostTransacoes();

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      gap="$2xs"
      alignItems="center"
    >
      <Breadcrumb crumbs={["transactions", "createTransactions"]} />
      <Title as="h4" color="$brand">
        Criar transação
      </Title>
      <Box width={{ xs: "100%", lg: "1110px" }}>
        <Form isPending={isPending} onSubmit={mutate} />
      </Box>
    </Box>
  );
};

export default Create;
