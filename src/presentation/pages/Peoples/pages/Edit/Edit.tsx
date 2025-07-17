import React from "react";
import { useParams } from "react-router-dom";
import { Box, Title } from "@rarui-react/components";

import { useGetPessoasId, usePatchPessoasId } from "@/presentation/hooks/api";
import { Form } from "@/presentation/pages/Peoples/components";
import { Breadcrumb } from "@/presentation/components";

import type { PatchPessoasIdRequest } from "@/domain/usecases";

const Edit: React.FC = () => {
  const { id } = useParams();
  const { data } = useGetPessoasId({ id: `${id}` });
  const { mutate, isPending } = usePatchPessoasId({ id: `${id}` });

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      gap="$2xs"
      alignItems="center"
    >
      <Breadcrumb crumbs={["people", "editPeople"]} />
      <Title as="h4" color="$brand">
        Editar pessoa
      </Title>
      <Box width={{ lg: "1110px" }}>
        <Form
          defaultValues={data}
          isPending={isPending}
          onSubmit={(body: PatchPessoasIdRequest) => mutate(body)}
        />
      </Box>
    </Box>
  );
};

export default Edit;
