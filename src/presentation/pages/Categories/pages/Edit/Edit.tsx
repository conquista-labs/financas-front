import React from "react";
import { useParams } from "react-router-dom";
import { Box, Title } from "@rarui-react/components";

import {
  useGetCategoriasId,
  usePatchCategoriasId,
} from "@/presentation/hooks/api";
import { Form } from "@/presentation/pages/Categories/components";
import { Breadcrumb } from "@/presentation/components";

import type { PatchCategoriasIdRequest } from "@/domain/usecases";

const Edit: React.FC = () => {
  const { id } = useParams();
  const { data: response } = useGetCategoriasId({ id: `${id}` });
  const { mutate, isPending } = usePatchCategoriasId({ id: `${id}` });

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      gap="$2xs"
      alignItems="center"
    >
      <Breadcrumb crumbs={["categories", "editCategories"]} />
      <Title as="h4" color="$brand">
        Editar categoria
      </Title>
      <Box width={{ lg: "1110px" }}>
        <Form
          defaultValues={response?.data}
          isPending={isPending}
          onSubmit={(body: PatchCategoriasIdRequest) => mutate(body)}
        />
      </Box>
    </Box>
  );
};

export default Edit;
