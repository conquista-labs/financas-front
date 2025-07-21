import React from "react";
import { Box, Title } from "@rarui-react/components";

import { Form } from "@/presentation/pages/Transactions/components";
import { Breadcrumb } from "@/presentation/components";
import { usePostTransacoes } from "@/presentation/hooks/api";
import type { PostTransacoesRequest } from "@/domain/usecases";

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
      <Breadcrumb crumbs={["transactions", "createPeoples"]} />
      <Title as="h4" color="$brand">
        Criar transação
      </Title>
      <Box width={{ xs: "100%", lg: "1110px" }}>
        <Form
          isPending={isPending}
          onSubmit={(body: PostTransacoesRequest) => mutate(body)}
        />
      </Box>
    </Box>
  );
};

export default Create;
