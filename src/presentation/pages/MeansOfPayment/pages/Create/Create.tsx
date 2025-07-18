import React from "react";
import { Box, Title } from "@rarui-react/components";

import { Form } from "@/presentation/pages/MeansOfPayment/components";
import { Breadcrumb } from "@/presentation/components";
import { usePostMeiosPagamento } from "@/presentation/hooks/api";
import type { PostMeiosPagamentoRequest } from "@/domain/usecases";

const Create: React.FC = () => {
  const { mutate, isPending } = usePostMeiosPagamento();

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      gap="$2xs"
      alignItems="center"
    >
      <Breadcrumb crumbs={["meansOfPayment", "createMeansOfPayment"]} />
      <Title as="h4" color="$brand">
        Criar meio de pagamento
      </Title>
      <Box width={{ xs: "100%", lg: "1110px" }}>
        <Form
          isPending={isPending}
          onSubmit={(body: PostMeiosPagamentoRequest) => mutate(body)}
        />
      </Box>
    </Box>
  );
};

export default Create;
