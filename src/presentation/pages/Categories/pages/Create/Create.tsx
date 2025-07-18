import React from "react";
import { Box, Title } from "@rarui-react/components";

import { Form } from "@/presentation/pages/Categories/components";
import { Breadcrumb } from "@/presentation/components";
import { usePostCategorias } from "@/presentation/hooks/api";
import type { PostCategoriasRequest } from "@/domain/usecases";

const Create: React.FC = () => {
  const { mutate, isPending } = usePostCategorias();

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      gap="$2xs"
      alignItems="center"
    >
      <Breadcrumb crumbs={["categories", "createCategories"]} />
      <Title as="h4" color="$brand">
        Criar categoria
      </Title>
      <Box width={{ xs: "100%", lg: "1110px" }}>
        <Form
          isPending={isPending}
          onSubmit={(body: PostCategoriasRequest) => mutate(body)}
        />
      </Box>
    </Box>
  );
};

export default Create;
