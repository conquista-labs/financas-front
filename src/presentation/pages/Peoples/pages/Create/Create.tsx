import React from "react";
import { Box, Title } from "@rarui-react/components";

import { Form } from "@/presentation/pages/Peoples/components";
import { Breadcrumb } from "@/presentation/components";
import { usePostPessoas } from "@/presentation/hooks/api";
import type { PostPessoasRequest } from "@/domain/usecases";

const Create: React.FC = () => {
  const { mutate, isPending } = usePostPessoas();

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      gap="$2xs"
      alignItems="center"
    >
      <Breadcrumb crumbs={["peoples", "createPeoples"]} />
      <Title as="h4" color="$brand">
        Criar pessoa
      </Title>
      <Box width={{ xs: "100%", lg: "1110px" }}>
        <Form
          isPending={isPending}
          onSubmit={(body: PostPessoasRequest) => mutate(body)}
        />
      </Box>
    </Box>
  );
};

export default Create;
